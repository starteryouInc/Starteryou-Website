import { useState, useEffect } from "react";
import { useNavigation } from "../../context/NavigationContext";
import FileUpload from "../Common/FileUpload";
import { API_CONFIG } from "@config/api";
import { toast } from "react-toastify";

const BestJob2 = () => {
  const { isAdmin } = useNavigation();
  const [uploadedFile, setUploadedFile] = useState(null); // Use uploadedFile for both uploaded and previewed images
  const title = "starteryou-v2"; // Set the title for fetching and uploading
  const [error, setError] = useState(null); // Error state for handling errors
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false); // State to track fetch attempt

  const fetchUploadedFile = async () => {
    console.log("2")
    // if (hasFetchedOnce) return; // Prevent fetching again if already attempted

    // try {
    //   const response = await fetch(
    //     `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileDownload(title)}`
    //   );
      
    //   if (!response.ok) {
    //     throw new Error("Network response was not ok");
    //   }

    //   const blob = await response.blob(); // Get the response as a Blob
    //   const url = URL.createObjectURL(blob); // Create a local URL for the Blob
    //   setUploadedFile(url); // Set the uploaded file data with its local URL
    //   setError(null); // Reset error state on successful fetch
    // } catch (error) {
    //   console.error("Error fetching uploaded file:", error);
    //   setError("Failed to load image"); // Set error message
    // } finally {
    //   setHasFetchedOnce(true); // Mark as fetch attempt made
    // }
  };

  useEffect(() => {
    fetchUploadedFile(); // Fetch the specific image on component mount
  }, []);

  // Handle file upload
  const handleFileChange = async (event) => {
    // const file = event.target.files[0];
    // const formData = new FormData();
    // formData.append("file", file); // Append the file to the FormData
    // formData.append("title", title); // Include the title for the update

    // try {
    //   const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileUpdate(title)}`, {
    //     method: "PUT",
    //     body: formData,
    //   });

    //   if (!response.ok) {
    //     throw new Error("Network response was not ok");
    //   }

    //   const data = await response.json();
    //   console.log("Image updated successfully:", data);

    //   setUploadedFile(URL.createObjectURL(file)); // Update the uploaded file state with the new image preview
    //   setError(null); // Reset error state on successful upload
    // } catch (error) {
    //   console.error("Error updating image:", error);
    //   setError("Error updating image"); // Set error message
    // }
    console.log("1")
  };

  const boxes = [
    {
      id: 0,
      iconSrc: "/LandingPage/Icons/page 1.svg",
      title: "Lorem Ipsum",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    {
      id: 1,
      iconSrc: "/LandingPage/Icons/userr.svg",
      title: "Learn from the best",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
  ];

  return (
    <div className="container mx-auto max-w-[1300px] px-4 py-12">
      <p>Hi</p>
    </div>
  );
};

export default BestJob2;
