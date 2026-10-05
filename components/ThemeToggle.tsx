"use client"
import { useEffect, useState } from 'react'

export default function ThemeToggle({ label='Theme' }: { label?: string }) {
  const [dark,setDark]=useState(false)
  const [ready,setReady]=useState(false)
  useEffect(()=>{
    const saved=localStorage.getItem('tsp-theme')
    const next=saved ? saved==='dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
    setDark(next); document.documentElement.dataset.theme=next?'dark':'light'; setReady(true)
  },[])
  function toggle(){ const next=!dark; setDark(next); document.documentElement.dataset.theme=next?'dark':'light'; localStorage.setItem('tsp-theme',next?'dark':'light') }
  return <button type="button" className="theme-toggle" onClick={toggle} aria-label={`${label}: switch to ${dark?'light':'dark'} mode`} title={`${label}: ${dark?'Dark':'Light'}`}><span className="theme-toggle-icon" aria-hidden="true">{ready?(dark?'☀':'☾'):'◐'}</span></button>
}
