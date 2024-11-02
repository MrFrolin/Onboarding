import { React, useState, useEffect } from "react";
import axios from "axios";

export default function FileList({ folder }) {
  const [files, setFiles] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
      fetch(`https://localhost:7170/file/${folder}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          }
      })
      .then((response) => response.json())
      .then((files) => {
        setFiles(files);
      });
  }, []);

  const downloadFile = async (fileName) => {
    try {
      const response = await axios.get(
        `https://localhost:7170/file/download/?fileName=${fileName}`,
        {
            headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const downloadUrl = response.data.url;

      window.open(downloadUrl, "_blank");
    } catch (error) {
      console.error("Error downloading file: ", error);
    }
  };

  return (
    <div>
      <ul className="">
        {files?.map((file, i) => {
          const fileName = file.substring(file.indexOf("/") + 1);
          return (
            <li
              key={i}
              onClick={() => downloadFile(file)}
              className="text-blue-700 hover:bg-gray-100 hover:text-blue-700 px-2 py-2 rounded-lg cursor-pointer transition duration-300 text-lg font-medium"
            >
              {fileName}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
