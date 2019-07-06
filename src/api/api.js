import axios from 'axios'
import qs from 'qs'

// axios 配置
axios.defaults.timeout = 1000 * 100; // 超时
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8' // 默认请求头
axios.defaults.baseURL = 'http://localhost:8081/csy' // 后端API Router注意前缀是 /csy

axios.interceptors.request.use((config) => {
  if(config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  return config 
}, (error) => {
  return Promise.reject(error)
})

axios.interceptors.response.use((res) => {
    return res
  }, (error) => {
    return Promise.reject(error)
  }
)

export default {
  shp2json: (data) => axios.create({headers:{"Content-type":"application/x-www-form-urlencoded"}}).post('/file/shp2json', data), 
  createUserCount: data => axios.create({headers:{"Content-type":"application/x-www-form-urlencoded"}}).post('/user/createUserCount', data), 
  uploadFile: (userId, fileName, data) => axios.create({headers:{'Content-Type':'multipart/form-data'}}).post('/file/uploadFile/' + userId + "/" + fileName, data), 
  executeFile: data => axios.create({headers:{"Content-type":"application/x-www-form-urlencoded"}}).post('/file/executeFile', data), 
  downloadFile: (userId, fileName) => axios.create({headers:{"Content-type":"application/x-www-form-urlencoded"}}).get("/file/downloadFile/"+userId+"/"+fileName),  
}
