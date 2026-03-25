import { useState } from "react"
import { HomePage } from "./components/HomePage";
import { WorkSpace } from "./components/workspace/Workspace";


function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    console.log(`file selected: ${file.name} size: ${file.size} bytes`)
  }

  const handleBack = () => setSelectedFile(null);

  if(selectedFile) {
    return <WorkSpace file={selectedFile} onBack={handleBack}/>
  }

  return <HomePage onFileSelect={handleFileSelect}/>
}

export default App
