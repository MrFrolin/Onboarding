import { useState, useEffect } from "react";

const Fetch = () => {
  const [photos, setPhotos] = useState([]);
  useEffect(() => {
    fetch("https://picsum.photos/v2/list")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setPhotos(data);
      });
  }, []);
  return (
    <div>
      <ul>
        {photos.map((photo) => (
          <li>
            <img
              key={photo.id}
              src={photo.download_url}
              alt={photo.title}
              width={200}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Fetch;
