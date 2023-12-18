import fetcher from '@/libs/fetcher'
import useSWR from 'swr'

const useMovieList = () => {
  const {data, error, isLoading} = useSWR('/api/movies', fetcher, {
    // we don't need api recall
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })
  return {
    data,
    error,
    isLoading
  }
}

export default useMovieList
