import { useState } from 'react';
import axios from 'axios';

function Uploade() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [learnMore, setLearnMore] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('message', 'You are an expert physician with over 1000 years of experience across all medical fields. I am uploading a medical report in PDF format. Please read and analyze it carefully. Identify and summarize all important points, providing a clear and accurate overview. Your analysis should include any potential issues, noting whether the findings are normal, concerning, or require further investigation. Ensure no critical details are missed, and deliver your response in a thorough, professional manner.');

    try {
      const response = await axios.post('http://localhost:3000/chat', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data.response);
      setImageUrl(response.data.image || '');
      setLearnMore(response.data.learnMore || ''); // Assuming learnMore is returned from backend
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getShortResponse = (response) => {
    return response.length > 200 ? response.substring(0, 200) + '... [Read more]' : response;
  };

  return (
    <div className='bg-blue-600 bg-cover bg-center min-h-screen lg:h-[40rem] text-center px-4 py-8'>
      <div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-white pt-[10rem]">Finally Understand Your Medical Notes</h1>
        <h3 className="font-bold text-xl sm:text-2xl md:text-3xl mt-4 text-white">Securely Translate Medical Notes into Plain English</h3>
      </div>
      <div className='flex flex-col lg:flex-row items-stretch justify-center gap-4 pt-[5rem] lg:pt-[15rem] pb-[5rem]'>
        <div className='bg-white w-full max-w-lg rounded-lg shadow-2xl p-4 flex flex-col'>
          <h2 className="text-xl font-medium mb-2">Upload Your Medical Note</h2>
          <textarea
            className="w-full rounded-lg mt-2 border px-2 py-2 outline-none resize-none flex-grow"
            name="note"
            id="notes"
            placeholder="Type or Paste your report..."
          ></textarea>
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-2"
          />
          <div className="bg-slate-100 my-4 rounded-lg hover:bg-slate-200 cursor-pointer">
            <button className="w-full p-3 font-semibold" onClick={handleUpload}>
              <span className="material-symbols-outlined">arrow_upward</span> Upload
            </button>
          </div>
          <div className="bg-gray-100 p-1">Keep the file size less than 2 MB</div>
        </div>
        <div className='bg-white w-full max-w-lg rounded-lg shadow-2xl p-4 relative flex flex-col'>
          <h1 className="text-xl border-b-4 pb-2 font-semibold">Translation</h1>
          <div className={`text-black mt-2 flex-grow overflow-y-auto ${isExpanded ? 'h-auto' : 'h-[300px]'}`}>
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div role="status">
                  <svg aria-hidden="true" className="w-8 h-8 mt-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <div className={`transition-all`}>
                <p className="text-lg leading-relaxed">
                  {isExpanded ? result : getShortResponse(result)}
                </p>
              </div>
            )}
          </div>
          {result.length > 200 && (
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleToggleExpand}
            >
              {isExpanded ? 'Show Less' : 'Show More'}
            </button>
          )}
          {imageUrl && (
            <div className="mt-4">
              <img src={imageUrl} alt="Generated Medical Illustration" className="max-w-full h-auto rounded-lg shadow-lg" />
            </div>
          )}
          {learnMore && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">Learn More</h2>
              <p className="text-md">{learnMore}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Uploade;
