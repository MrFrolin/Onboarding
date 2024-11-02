import React, { useState } from "react";
import axios from "axios";

export default function UploadDoc({ folder }) {
  const [file, setFile] = useState(null);

  const token = localStorage.getItem("token");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `https://localhost:7170/file/upload?folder=${folder}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // token is the access token
          },
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("File upload failed.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-5">
      <label
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        htmlFor="user_avatar"
      >
        Upload file
      </label>
      <form className="py-1 w-full flex" onSubmit={(e) => e.preventDefault()}>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          id="user_avatar"
          type="file"
          onChange={handleFileChange}
          htmlFor="file-upload"
        />
        <button
          type="button"
          className="ml-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-3 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={uploadFile}
          disabled={!file}
        >
          Upload
        </button>
      </form>
    </div>
  );
}
