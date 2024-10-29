import { useState, useEffect } from "react";
import { useNavigation } from "../../context/NavigationContext";
import FileUpload from "../Common/FileUpload"

const icons = [
  {
    src: "/LandingPage/Icons/dashboard.svg",
    alt: "Dashboard Icon",
    text: "Dashboard",
    link: "/dashboard",
  },
  {
    src: "/LandingPage/Icons/social.svg",
    alt: "Settings Icon",
    text: "Teams and socials",
    link: "/teams-socials",
  },
  {
    src: "/LandingPage/Icons/user-square.svg",
    alt: "User Icon",
    text: "Job Profile",
    link: "/job-profile",
  },
  {
    src: "/LandingPage/Icons/subscribe.svg",
    alt: "Analytics Icon",
    text: "Subscription Management",
    link: "/subscription-management",
  },
  {
    src: "/LandingPage/Icons/Setting.png",
    alt: "Tools Icon",
    text: "Lorem ipsum",
    link: "/lorem-ipsum",
  },
];

const BestBuddy = () => {
  const [uploadedFile, setUploadedFile] = useState(null); // Store the uploaded file
  const title = "bestbuddy"; // Title of the specific image to be fetched/updated
  const { isAdmin } = useNavigation();

  // Function to fetch a specific file (image) by title
  const fetchUploadedFile = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/files/title/${title}`); // Fetch by title
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob(); // Get the response as a Blob
      const url = URL.createObjectURL(blob); // Create a local URL for the Blob
      setUploadedFile({ title: title, url }); // Set the uploaded file data with its local URL
    } catch (error) {
      console.error("Error fetching uploaded file:", error);
    }
  };

  useEffect(() => {
    fetchUploadedFile(); // Fetch the specific image on component mount
  }, []);

  // Handle file upload
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title); // Include the title in the upload
    formData.append("uploadedBy", "Employee");

    try {
      const response = await fetch("http://localhost:5001/api/files/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("File uploaded successfully:", data);
      setUploadedFile({ title: data.file.title, url: URL.createObjectURL(file) }); // Immediate preview of uploaded file
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // Handle image update
  const handleUpdateImage = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title); // Include the title for the update

    try {
      const response = await fetch(`http://localhost:5001/api/files/update`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Image updated successfully:", data);

      // Show immediate preview with the new file before re-fetching
      const newUrl = URL.createObjectURL(file);
      setUploadedFile({ title: data.file.title, url: newUrl });

      // Re-fetch the image using the title after the update
      fetchUploadedFile();
    } catch (error) {
      console.error("Error updating image:", error);
    }
  };

  return (
    <div className="bg-white py-20 px-4 sm:py-24">
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold lg:font-extrabold text-[#1F2329] mb-6">
          The best buddy for your career
        </h2>
        <p className="text-[#1F2329] text-base font-light sm:text-lg md:text-xl leading-relaxed max-w-4xl mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      </div>

      {/* Display the uploaded file */}
      <div className="relative flex justify-center mt-2">
        {uploadedFile ? (
          <img
            src={uploadedFile.url} // Use the local URL created from the Blob
            alt="Uploaded"
            className="w-[900px] h-[300px] md:h-[450px]"
          />
        ) : (
          <img
            src="/JobPortalPage/Placeholder Image.png"
            alt="Placeholder"
            className="w-[900px] h-[300px] md:h-[450px]"
          />
        )}
      </div>

      {/* Upload and Update Buttons */}
      <div className="flex justify-center mt-4">
        <FileUpload handleFileChange={handleFileChange} /> {/* Upload new image */}
        {isAdmin && (
          <div className="ml-4">
            <input
              type="file"
              onChange={handleUpdateImage} // Separate handler for updating
              className="hidden"
              id="updateFileInput"
            />
            <label
              htmlFor="updateFileInput"
              className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded"
            >
              Update Image
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default BestBuddy;
