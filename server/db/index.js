const sha1 = require('sha1')
const axios = require('axios')

const className = 'todo'

const request = axios.create({
  baseURL: 'https://d.apicloud.com/mcm/api'
})

const createError = (code, res) => {
  const err = new Error(res.message)
  err.code = code
  return err
}

const handleRequest = ({ status, data, ...rest }) => {
  if (status === 200) {
    return data
  } else {
    throw createError(status, rest)
  }
}

module.exports = (appId, appKey) => {
  const getHeaders = () => {
    const now = Date.now()
    return {
      'X-APICloud-AppId': appId,
      'X-APICloud-AppKey': `${sha1(`${appId}UZ${appKey}UZ${now}`)}.${now}`
    }
  }
  return {
    async getAllTodos() {
      return handleRequest(
        await request.get(`/${className}`, { headers: getHeaders() })
      )
    },
    async addTodo(todo) {
      return handleRequest(
        await request.post(`/${className}`, todo, { headers: getHeaders() })
      )
    },
    async updateTodo(id, todo) {
      return handleRequest(
        await request.put(`/${className}/${id}`, todo, {
          headers: getHeaders()
        })
      )
    },
    async deleteTodo(id) {
      return handleRequest(
        await request.delete(`/${className}/${id}`, { headers: getHeaders() })
      )
    },
    async deleteCompleted(ids) {
      // requests是默认变量名，不能更改
      const requests = ids.map(id => {
        return {
          method: 'DELETE',
          path: `/mcm/api/${className}/${id}`
        }
      })
      return handleRequest(
        await request.post('/batch', { requests }, { headers: getHeaders() })
      )
    }
  }
}
