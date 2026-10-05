export default function ConnectionNotice({message}:{message?:string}) {
  return <section className="connection-notice page-pad"><div className="empty-card"><p className="eyebrow">Content service</p><h1>The website content is temporarily unavailable.</h1><p>{message || 'The public content API could not be reached. Please try again shortly.'}</p></div></section>
}
