import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { moviesAPI } from '../api/services';
import { useBookingStore } from '../store/bookingStore';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const { selectMovie } = useBookingStore();

  const fetchMovies = useCallback(async (page = pagination.page) => {
    try {
      setLoading(true);
      const response = await moviesAPI.getMovies({ 
        page, 
        limit: 100  // Fetch more movies for search
      });
      const moviesData = response.data.data || [];
      setAllMovies(moviesData);
      setMovies(moviesData);
      setPagination(prev => ({
        ...prev,
        ...response.data.meta
      }));
    } catch (err) {
      setError('Failed to load movies. Please try again.');
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page]);

  const filterMovies = useCallback(() => {
    if (!searchQuery.trim()) {
      setMovies(allMovies);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allMovies.filter(movie => 
      movie.title.toLowerCase().includes(query) ||
      (movie.genre && movie.genre.toLowerCase().includes(query)) ||
      (movie.language && movie.language.toLowerCase().includes(query)) ||
      (movie.director && movie.director.toLowerCase().includes(query)) ||
      (movie.cast && movie.cast.toLowerCase().includes(query))
    );
    setMovies(filtered);
  }, [searchQuery, allMovies]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    filterMovies();
  }, [filterMovies]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleMovieSelect = (movie) => {
    selectMovie(movie);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-slate-600">Loading movies...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchMovies(pagination.page)}
              className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">Now Showing</h1>
          <p className="text-sm sm:text-base text-slate-600">Choose a movie to see showtimes</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search movies by title, genre, language, cast or director..."
              className="block w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:placeholder-slate-500 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-sm sm:text-base transition-all"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-slate-700 text-slate-400 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-center text-sm text-slate-600 mt-2">
              Found {movies.length} {movies.length === 1 ? 'movie' : 'movies'} matching "{searchQuery}"
            </p>
          )}
        </div>

        {movies.length === 0 ? (
          <div className="text-center py-12">
            {searchQuery ? (
              <div>
                <MagnifyingGlassIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg font-medium mb-2">No movies found</p>
                <p className="text-slate-500 text-sm mb-4">
                  No results for "{searchQuery}"
                </p>
                <button
                  onClick={clearSearch}
                  className="text-slate-800 hover:text-slate-900 font-medium text-sm underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <p className="text-slate-600">No movies available at the moment.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {movies.map((movie) => (
              <div key={movie.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200 w-full max-w-sm mx-auto sm:max-w-none flex flex-col h-full">
                {/* Fixed aspect ratio container for poster */}
                <div className="aspect-[2/3] bg-slate-100 relative overflow-hidden rounded-t-lg">
                  {movie.posterUrl ? (
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-200 hover:scale-[1.02]"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/300x450/1f2937/ffffff?text=${encodeURIComponent(movie.title.substring(0, 20))}`;
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-slate-200 flex items-center justify-center p-3">
                      <div className="text-slate-400 text-xs sm:text-sm font-bold text-center break-words leading-tight">
                        {movie.title}
                      </div>
                    </div>
                  )}
                  
                  {/* Subtle overlay for better visual depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
                </div>
                
                {/* Card content with consistent spacing */}
                <div className="p-3 sm:p-4 flex flex-col flex-1">
                  {/* Movie title with consistent height */}
                  <h3 
                    className="font-semibold text-slate-900 mb-2 text-sm sm:text-base break-words overflow-hidden leading-tight"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: '2.8em',
                      maxHeight: '2.8em'
                    }}
                    title={movie.title}
                  >
                    {movie.title}
                  </h3>
                  
                  {/* Movie Meta Info */}
                  <div className="space-y-1.5 mb-3">
                    {/* Genre and Language */}
                    <div className="flex flex-wrap gap-1.5">
                      {movie.genre && (
                        <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                          {movie.genre.split(',')[0].trim()}
                        </span>
                      )}
                      {movie.language && (
                        <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                          {movie.language.split(',')[0].trim()}
                        </span>
                      )}
                      {movie.certificate && (
                        <span className="inline-block px-2 py-0.5 bg-orange-50 text-orange-700 rounded text-xs font-medium">
                          {movie.certificate}
                        </span>
                      )}
                    </div>
                    
                    {/* Rating and Duration */}
                    <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600">
                      {movie.rating && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                          <span className="font-medium">{movie.rating}</span>
                        </div>
                      )}
                      {movie.durationMin && (
                        <span>{Math.floor(movie.durationMin / 60)}h {movie.durationMin % 60}m</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Button container - always at bottom */}
                  <div className="mt-auto">
                    <Link
                      to={`/movies/${movie.id}/cinemas`}
                      onClick={() => handleMovieSelect(movie)}
                      className="block w-full bg-slate-800 text-white text-center py-2.5 rounded-lg hover:bg-slate-900 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium"
                    >
                      Book Tickets
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!searchQuery && pagination.totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage || loading}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span>Previous</span>
            </button>
            
            <div className="flex items-center space-x-1 sm:space-x-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  disabled={loading}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    page === pagination.page
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-600 bg-white border border-slate-300 hover:bg-slate-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage || loading}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>Next</span>
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Pagination Info */}
        {!searchQuery && pagination.total > 0 && (
          <div className="mt-4 text-center text-sm text-slate-600">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} movies
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;