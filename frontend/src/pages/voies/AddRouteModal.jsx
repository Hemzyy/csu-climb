import { useEffect, useState, useRef } from "react";
import useAddRoute from "../../hooks/useAddRoute";
import { IoCloseSharp } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";

const AddRouteModal = () => {
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    difficultyPoints: "",
    sector: "",
    img: null,
    thumbnail: null, // Add thumbnail field
  });

  const imgRef = useRef(null);
  const thumbnailRef = useRef(null); // Ref for thumbnail input
  const { addRoute, isAddingRoute } = useAddRoute();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, img: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, thumbnail: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addRoute(formData);
  };

  return (
    <>
      <button
        className="btn btn-outline btn-sm w-full"
        onClick={() => document.getElementById("add_route_modal").showModal()}
      >
        Add Route
      </button>
      <dialog id="add_route_modal" className="modal">
        <div className="modal-box border rounded-md border-gray-700 shadow-md text-slate-200">
          <h3 className="font-bold text-lg my-3">Add Route</h3>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Route name"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.name}
                name="name"
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Grade"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.grade}
                name="grade"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Points"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.difficultyPoints}
                name="difficultyPoints"
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Secteur"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.sector}
                name="sector"
                onChange={handleInputChange}
              />
            </div>

            {/* Main Image Upload Section */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">
                Main Image
              </label>
              {formData.img && (
                <div className="relative w-72 mx-auto">
                  <IoCloseSharp
                    className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        img: null,
                      }))
                    }
                  />
                  <img
                    src={formData.img}
                    className="w-full mx-auto h-72 object-contain rounded"
                    alt="Main Image Preview"
                  />
                </div>
              )}
              <button
                type="button"
                className="btn btn-outline btn-sm w-full flex items-center justify-center gap-2"
                onClick={() => imgRef.current.click()}
              >
                <CiImageOn className="w-5 h-5" />
                <span>Upload Main Image</span>
              </button>
              <input
                type="file"
                accept="image/*"
                hidden
                ref={imgRef}
                onChange={handleImgChange}
              />
            </div>

            {/* Thumbnail Upload Section */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">
                Thumbnail
              </label>
              {formData.thumbnail && (
                <div className="relative w-32 mx-auto">
                  <IoCloseSharp
                    className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        thumbnail: null,
                      }))
                    }
                  />
                  <img
                    src={formData.thumbnail}
                    className="w-full mx-auto h-32 object-contain rounded"
                    alt="Thumbnail Preview"
                  />
                </div>
              )}
              <button
                type="button"
                className="btn btn-outline btn-sm w-full flex items-center justify-center gap-2"
                onClick={() => thumbnailRef.current.click()}
              >
                <CiImageOn className="w-5 h-5" />
                <span>Upload Thumbnail</span>
              </button>
              <input
                type="file"
                accept="image/*"
                hidden
                ref={thumbnailRef}
                onChange={handleThumbnailChange}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end border-t py-2 border-t-gray-700">
              <button className="btn btn-primary rounded-full btn-sm text-white">
                {isAddingRoute ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  "Add Route"
                )}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="outline-none">close</button>
        </form>
      </dialog>
    </>
  );
};

export default AddRouteModal;