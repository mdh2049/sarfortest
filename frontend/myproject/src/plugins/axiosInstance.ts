import axios, {type AxiosInstance} from 'axios'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:18080/sar-app'
})

export default axiosInstance
