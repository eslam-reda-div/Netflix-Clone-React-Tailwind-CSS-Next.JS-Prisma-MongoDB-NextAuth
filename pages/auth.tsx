import Input from '@/components/input'
import Image from 'next/image'
import React, { useCallback } from 'react'
import axios from 'axios'
import { getSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { NextPageContext } from 'next'

export async function getServerSideProps(context: NextPageContext) {
    const session = await getSession(context)
  
    if (session) {
      return {
        redirect: {
          destination: '/profiles',
          permanent: false
        }
      }
    }
  
    return {
      props: {}
    }
  
  }

const Auth = () => {
    const router = useRouter()

    const [email, setEmail] = React.useState('')
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [variant, setVariant] = React.useState('login')
    const [error, setError] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const [regestered, setRegestered] = React.useState(false)

    const toggleVariant = useCallback(() => {
        setVariant((prev) => prev === 'login' ? 'register' : 'login')
    }, [])

    const register = useCallback(async () => {
        try {
            if (email === '' || password === '' || username === '') {
                setError('Please fill all the fields')
            }else {
                setLoading(true)
                await axios.post('/api/register', {
                    email,
                    name: username,
                    password
                }).then(() => {
                    setVariant('login')
                    setEmail('')
                    setUsername('')
                    setPassword('')
                    setError('')
                    setLoading(false)
                    setRegestered(true)
                })
            }
        } catch (error) {
            // console.log(error)
            if ((error as any).response.data.error) {
                setError((error as any).response.data.error)
                setLoading(false)
                setEmail('')
                setUsername('')
                setPassword('')
            }
        }
    }, [email, password, username])
   
    const login = useCallback(async () => {
        try {
            if (email === '' || password === '') {
                setError('Please fill all the fields')
            }else {
                setLoading(true)
                await signIn('credentials', {
                    redirect: false,
                    email,
                    password,
                    callbackUrl: '/profiles'
                }).then((e) => {
                    setLoading(false)
                    if (e?.error) {
                        setError(e.error)
                    }else{
                        router.push('/profiles')
                    }
                })
            }
        } catch (error) {
            if ((error as any).response.data.error) {
                setError((error as any).response.data.error)
            }
        }
    }, [email, password, router])

    return (
        <div className='h-full relative w-full bg-[url("/images/hero.jpg")] bg-no-repeat bg-center bg-fixed bg-cover'>
            <div className=' bg-black w-full h-full lg:bg-opacity-50'>
                <nav className=' px-12 py-5'>
                    <Image src='/images/logo.png' width={150} height={12} alt={''} />
                </nav>
                <div className=' flex justify-center'>
                    <div className=' bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full'>
                        <h2 className=' text-white text-4xl mb-8 font-semibold'>
                            {variant === 'login' ? 'Sign In' : 'Register'}
                        </h2>
                        {error && (
                            <p className='text-red-500 mb-4'>
                                {error}
                            </p>
                        )}
                        {regestered && (
                            <p className='text-green-500 mb-4'>
                                You have been registered successfully
                            </p>
                        )} 
                        <div className=' flex flex-col gap-4'>
                            {variant === 'register' && (
                                <Input 
                                label='Username'
                                id='name'
                                type='text'
                                onChange={(e: { target: { value: React.SetStateAction<string> } }) => setUsername(e.target.value)}
                                value={username}
                                />
                            )}
                            <Input 
                                label='Email'
                                id='email'
                                type='email'
                                onChange={(e: { target: { value: React.SetStateAction<string> } }) => setEmail(e.target.value)}
                                value={email}
                            />
                            <Input 
                                label='Password'
                                id='password'
                                type='password'
                                onChange={(e: { target: { value: React.SetStateAction<string> } }) => setPassword(e.target.value)}
                                value={password}
                            />
                        </div>
                        <button onClick={variant === 'login' ? login : register} className=' bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition'>
                            {loading ? 'Loading...' : variant === 'login' ? 'Sign In' : 'Register'}
                        </button>
                        <div className='flex flex-row items-center gap-4 mt-8 justify-center'>
                            <button onClick={() => signIn('google', {callbackUrl: '/profiles'})} className=' bg-[#4285F4] py-3 text-white rounded-md w-full hover:bg-[#357AE8] transition justify-center flex'>
                                <FcGoogle size={20} />
                            </button>
                            <button onClick={() => signIn('github', {callbackUrl: '/profiles'})} className=' bg-[#333] py-3 text-white rounded-md w-full hover:bg-[#222] transition justify-center flex'>
                                <FaGithub size={20} />
                            </button>
                        </div>
                        <p className=' text-neutral-500 mt-12'>
                            {variant === 'login' ? 'Don\'t have an account?' : 'Already have an account?'}
                            <span className=' text-white ml-1  hover:underline cursor-pointer' onClick={toggleVariant}>
                                {variant === 'login' ? 'Create an account' : 'login'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth