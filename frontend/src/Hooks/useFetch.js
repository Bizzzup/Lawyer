import React, { useEffect, useState } from 'react'
import api from '../api/apiUrl'
import { useNavigate } from 'react-router-dom'

const useFetch = (url) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
          try {
            setLoading(true)
            const response = await api.get(url)
            setData(response.data)
          } catch (err) {
            setError(err.message)
          } finally {
            setLoading(false)
          }
        }
        fetchData()
      }, [navigate])
  return [data, loading, error]
}

export default useFetch