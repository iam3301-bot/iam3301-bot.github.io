// GameBox 游戏数据 API 工具
// 支持从 FreeToGame API 和本地 ranking.json 加载数据

class GameAPI {
  constructor() {
    this.cache = {
      allGames: null,
      timestamp: null
    };
    this.CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存
    this.API_URL = 'https://www.freetogame.com/api/games';
    this.LOCAL_RANKING = 'ranking.json';
  }

  /**
   * 获取所有游戏数据（优先使用缓存）
   */
  async getAllGames() {
    // 检查缓存
    if (this.cache.allGames && this.cache.timestamp) {
      const cacheAge = Date.now() - this.cache.timestamp;
      if (cacheAge < this.CACHE_DURATION) {
        console.log('使用缓存的游戏数据');
        return this.cache.allGames;
      }
    }

    try {
      console.log('从 FreeToGame API 加载游戏数据...');
      const response = await fetch(this.API_URL);
      
      if (!response.ok) {
        throw new Error(`API 请求失败: ${response.status}`);
      }

      const games = await response.json();
      
      // 格式化数据
      const formattedGames = games.map(game => ({
        id: game.id,
        name: game.title,
        cover: game.thumbnail,
        description: game.short_description,
        genre: game.genre,
        platform: game.platform,
        publisher: game.publisher,
        developer: game.developer,
        releaseDate: game.release_date,
        gameUrl: game.game_url,
        profileUrl: game.freetogame_profile_url,
        // 计算评分（基于随机值，实际应用中应该从真实评分源获取）
        score: (Math.random() * 2 + 7).toFixed(1)
      }));

      // 缓存数据
      this.cache.allGames = formattedGames;
      this.cache.timestamp = Date.now();

      console.log(`成功加载 ${formattedGames.length} 款游戏数据`);
      return formattedGames;
    } catch (error) {
      console.error('从 API 加载失败，尝试使用本地数据:', error);
      return await this.getLocalGames();
    }
  }

  /**
   * 从本地 ranking.json 获取游戏数据（作为备用）
   */
  async getLocalGames() {
    try {
      const response = await fetch(this.LOCAL_RANKING);
      if (!response.ok) {
        throw new Error(`本地数据加载失败: ${response.status}`);
      }

      const data = await response.json();
      const allGames = [
        ...(data.hot || []),
        ...(data.score || []),
        ...(data.new || []),
        ...(data.discount || [])
      ];

      // 去重
      const seen = new Set();
      const uniqueGames = allGames.filter(game => {
        if (seen.has(game.id)) return false;
        seen.add(game.id);
        return true;
      });

      console.log(`从本地加载 ${uniqueGames.length} 款游戏数据`);
      return uniqueGames;
    } catch (error) {
      console.error('本地数据加载失败:', error);
      return [];
    }
  }

  /**
   * 按类型筛选游戏
   */
  filterByGenre(games, genre) {
    if (!genre || genre === 'all') return games;
    return games.filter(game => 
      game.genre && game.genre.toLowerCase().includes(genre.toLowerCase())
    );
  }

  /**
   * 按平台筛选游戏
   */
  filterByPlatform(games, platform) {
    if (!platform || platform === 'all') return games;
    return games.filter(game => 
      game.platform && game.platform.toLowerCase().includes(platform.toLowerCase())
    );
  }

  /**
   * 搜索游戏
   */
  searchGames(games, keyword) {
    if (!keyword || keyword.trim() === '') return games;
    const kw = keyword.toLowerCase();
    return games.filter(game => 
      (game.name && game.name.toLowerCase().includes(kw)) ||
      (game.description && game.description.toLowerCase().includes(kw)) ||
      (game.genre && game.genre.toLowerCase().includes(kw))
    );
  }

  /**
   * 按评分排序
   */
  sortByScore(games, descending = true) {
    return [...games].sort((a, b) => {
      const scoreA = parseFloat(a.score) || 0;
      const scoreB = parseFloat(b.score) || 0;
      return descending ? scoreB - scoreA : scoreA - scoreB;
    });
  }

  /**
   * 按发布日期排序
   */
  sortByDate(games, descending = true) {
    return [...games].sort((a, b) => {
      const dateA = new Date(a.releaseDate || '2000-01-01');
      const dateB = new Date(b.releaseDate || '2000-01-01');
      return descending ? dateB - dateA : dateA - dateB;
    });
  }

  /**
   * 分页获取数据
   */
  paginate(games, page = 1, pageSize = 20) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      data: games.slice(start, end),
      total: games.length,
      page: page,
      pageSize: pageSize,
      hasMore: end < games.length
    };
  }
}

// 创建全局实例
window.gameAPI = new GameAPI();
