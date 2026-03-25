import { Header } from "./Header"
import { Layout } from "./Layout"
import { UploadZone } from "./UploadZone";
import { InfoSection } from "./InfoSection";



export function HomePage({onFileSelect}: {onFileSelect: (f: File) => void}) {

  return (
    <Layout>
      <Header/>
      <main className="flex-1 flex flex-col px-6">
        <div className="flex-1 flex items-center justify-center py-12">
          <UploadZone onFileSelect={onFileSelect}/>
        </div>
        <InfoSection/>
      </main>
    </Layout>
  )
}
