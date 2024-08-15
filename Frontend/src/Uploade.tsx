import { useState, useRef } from 'react';
import axios from 'axios';

function Uploade() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasResponse, setHasResponse] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = event.target.files;
    if (filesList && filesList.length > 0) {
      const file = filesList[0];
      setFile(file);
      setFiles(Array.from(filesList)); 
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileUrl(event.target.value);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('message', 
      'You are an expert physician with over 1000 years of experience, and you specialize in explaining complex medical information to patients in a way they can easily understand. I am uploading a medical report in PDF format. Please read and analyze it carefullyIdentify and summarize the Impression section, considering the entire report. Your summary should provide a clear and concise overview that a non-medical person can understand. Explain any medical terms in plain language, using simple analogies where possible. Highlight any findings that are normal, concerning, or require further investigation, ensuring no important details are overlooked. Deliver your response in a friendly, reassuring tone.Please refrain from suggesting next steps and do not add any external URL and reference');
    try {
      const response = await axios.post('http://localhost:3000/chat', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data.response);
      setImageUrl(response.data.image || '');
      setHasResponse(true);
      setIsExpanded(true); 
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClose = () => {
    setHasResponse(false);
    setIsExpanded(false);
  };

  const getShortResponse = (response: string) => {
    return response.length > 200 ? response.substring(0, 200) + '... [Read more]' : response;
  };

  const formatResponse = (text: string) => {
    return text
      .replace(/###/g, '<h3>')
      .replace(/(.*?):/g, '<strong>$1:</strong>')
      .replace(/ - /g, '<li>')
      .replace(/\n/g, '<br/>')
      .replace(/<\/li>/g, '</li><br/>')
      .replace(/<\/h3><br\/>/g, '</h3>');
  };

  return (
    <div className="bg-blue-600 bg-cover bg-center min-h-screen lg:h-[40rem] text-center px-4 py-8">
      <div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-white pt-[10rem]">
          Finally Understand Your Medical Notes
        </h1>
        <h3 className="font-bold text-xl sm:text-2xl md:text-3xl mt-4 text-white">
          Securely Translate Medical Notes into Plain English
        </h3>
      </div>
      <div className="relative flex flex-col lg:flex-row items-stretch justify-center gap-4 pt-[5rem] lg:pt-[15rem] pb-[5rem]">
        <div
          className={`bg-white w-full max-w-lg rounded-lg shadow-2xl p-4 flex flex-col transition-all duration-300 lg:ml-16 ${
            hasResponse && isExpanded ? 'hidden' : ''
          }`}
        >
          <h2 className="text-xl font-medium mb-2">Upload Your Medical Note</h2>
          
          <div
            className="border-dashed border-2 border-gray-300 p-6 rounded-lg mb-4 cursor-pointer"
            onClick={handleFileBrowseClick}
          >
            <p className="text-center text-gray-500">
              Drag and Drop or{' '}
              <span className="text-green-600">Click to Browse</span>
            </p>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          
          <div>
            <label className="text-gray-700">Link to a file</label>
            <input
              type="text"
              name="fileUrl"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Add File URL"
              value={fileUrl}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="mt-4">
            {files.length > 0 && (
              <ul className="list-disc pl-5">
                {files.map((file, index) => (
                  <li key={index} className="text-gray-700">
                    {file.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-slate-100 my-4 rounded-lg hover:bg-slate-200 cursor-pointer">
            <button
              className="w-full p-3 font-semibold"
              onClick={handleUpload}
            >
              <span className="material-symbols-outlined">arrow_upward</span>{' '}
              Upload
            </button>
          </div>
          <div className="bg-gray-100 p-1">Keep the file size less than 2 MB</div>
        </div>
        <div
          className={`bg-white w-full lg:mx-[5rem] rounded-lg shadow-2xl p-4 relative flex flex-col transition-all duration-300 ${
            hasResponse ? 'h-auto' : ''
          }`}
        >
          {hasResponse && (
            <button
              className="absolute top-4 lg:right-4 text-black"
              onClick={handleClose}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
          <h1 className="text-xl border-b-4 pb-2 font-semibold">Translation</h1>
          <div
            className={`text-black mt-2 flex-grow overflow-y-auto transition-all duration-300 ${
              hasResponse && !isExpanded ? 'h-[150px]' : 'h-auto'
            }`}
            dangerouslySetInnerHTML={{ __html: isLoading ? 'Loading...' : formatResponse(isExpanded ? result : getShortResponse(result)) }}
          />
          {imageUrl && (
            <div className="my-4 rounded-xl shadow-xl">
              <img 
                src={imageUrl} 
                alt="Generated Medical Illustration" 
                className={`w-full rounded-2xl ${
                  isExpanded ? 'h-[500px] px-[20rem] py-8' : 'h-[250px] px-[10rem] py-2'
                }`}
              />
            </div>
          )}
          {result.length > 200 && (
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleToggleExpand}
            >
              {isExpanded ? 'Collapse' : 'Read More'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Uploade;
