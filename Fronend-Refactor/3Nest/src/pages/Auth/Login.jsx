import React, { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import { Link, useNavigate } from 'react-router-dom'
import { decodeToken, validateEmail } from '../../utils/help'
import { API_PATHS, BASE_URL } from '../../utils/apiPath'
import axiosInstance from '../../utils/axiosIntance'
import Input from '../../components/input/Input'

const Login = () => {
    const [user_email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = React.useState(null)

    const navigate = useNavigate()
    // const { updateUser } = useContext(UserContext)
    const handleLogin = async (e) => {
        e.preventDefault()

        if(!validateEmail(user_email)) {
            setError('Vui lòng nhập email hợp lệ')
            return
        }

        if(!password) {
            setError('Vui lòng nhập mật khẩu')
            return
        }

        setError("");
        console.log("Route login", API_PATHS.AUTH.LOGIN)

        try {
            // const respone = await fetch(BASE_URL + API_PATHS.AUTH.LOGIN, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         user_email,
            //         password
            //     })
            // })
            const respone = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
                user_email,
                password
            })

            const {access_token} = respone.data

            // const decode = decodeToken(access_token)
            // console.log(decode)
            if(access_token) {
                localStorage.setItem("access_token", access_token);
                navigate("/dashboard");
            }   
            console.log("Login response:", respone.data)
        } catch (error) {
            console.error("Login error:", error)
            setError('Đăng nhập không thành công. Vui lòng thử lại.')
            return
        }
    }

  return (
    <div className='h-full items-center flex flex-col justify-center top-20'>
        <h3 className='text-xl font-semibold text-black'>Welcome</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>Please fill out form bellow to login</p>
        <form onSubmit={handleLogin}>
          <Input 
            value={user_email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="abc@example.com"
            label="Email"
            type="text"  
          />

          <Input 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            label="Password"
            type="password"  
          />

          {error && (
            <p className='text-red-500 text-xs pb-2.5'>{error}</p>
          )}
          <button type='submit' className='btn-primary'>
            Login
          </button>
          <p className='text-slate-800 mt-3'>You do not have an account?
            <Link to='/' className='text-primary underline'>Sign Up</Link>
          </p>
        </form>
      </div>
  )
}

export default Login
