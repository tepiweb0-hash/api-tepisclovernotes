import type { Bootstrap } from '@/lib/types'
import FloatingNav from './FloatingNav'
import Footer from './Footer'
import MessageUs from './MessageUs'

const cssColor=(v:any,fallback:string)=>/^#[0-9a-f]{3,8}$/i.test(String(v||''))?String(v):fallback
const cssLength=(v:any,fallback:string)=>/^\d+(\.\d+)?(px|rem|em|%)$/.test(String(v||''))?String(v):fallback
const fontFamily=(v:any,fallback:string)=>String(v||'').replace(/[^a-zA-Z0-9 _-]/g,'').trim()||fallback

export default function SiteShell({data,children}:{data:Bootstrap,children:React.ReactNode}){
  const bodyFont=data.fonts.find(f=>f.role==='body'&&f.enabled!==false)
  const headingFont=data.fonts.find(f=>f.role==='heading'&&f.enabled!==false)
  const fontUrls=Array.from(new Set(data.fonts.filter(f=>f.enabled!==false&&/^https:\/\/fonts\.googleapis\.com\//.test(String(f.google_css_url||''))).map(f=>String(f.google_css_url))))
  // Public-site brand palette. Fonts and radius remain CMS-controlled, while the
  // visual brand colors are intentionally locked to the approved Teshow/Ping palette.
  const style:any={
    '--navy':'#986f53',       // primary brown
    '--frost':'#f2ded1',      // warm beige
    '--pink':'#fad6e6',       // light pink
    '--green':'#eda9c9',      // stronger pink accent (legacy semantic var)
    '--ink':'#2f2520',
    '--paper':'#ffffff',
    '--surface':'#ffffff',
    '--surface-2':'#f2ded1',
    '--muted':'#7a6254',
    '--line':'#e7d6cb',
    '--dark-bg':'#2f211b',
    '--dark-surface':'#463229',
    '--dark-surface-alt':'#5a4033',
    '--dark-text':'#ffffff',
    '--dark-muted':'#f2ded1',
    '--dark-line':'#986f53',
    '--radius':cssLength(data.theme.radius_card,'28px'),'--font-body':`'${fontFamily(bodyFont?.family,'Inter')}', Inter, sans-serif`,'--font-heading':`'${fontFamily(headingFont?.family,'Manrope')}', Manrope, sans-serif`
  }
  return <div className="site-theme" style={style}>{fontUrls.map(url=><link key={url} rel="stylesheet" href={url}/>)}<FloatingNav data={data}/><main>{children}</main><Footer data={data}/><MessageUs data={data}/></div>
}
