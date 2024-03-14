import { ChangeEvent, FC, useEffect, useState } from "react";
import { API_ROOT, API_URL } from "../../constants";
import axios from "../../lib";
import { toast } from "react-toastify";
import Display from "../../components/display";
import FileInput from "../../components/forms/file-input";
import { IGalleryPhoto } from "../../interfaces/product";
import { RxCross2 } from "react-icons/rx";
import { FaCheck } from "react-icons/fa";

interface IProps {
  slug: string;
}
interface IPhoto {
  id: number;
  product_id: number;
  image: string;
  order_number: number;
  created_at: string;
  updated_at: string;
}

const GalleryImages: FC<IProps> = ({ slug }) => {
  const [galleryImages, setGalleryImages] = useState<IGalleryPhoto[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [orderNumber] = useState((galleryImages?.length as number) + 1);
  const handleGalleryImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const formData = new FormData();

    if (e.target.files) {
      const file = e.target.files[0];
      formData.append("image", file);
      formData.append("order_number", orderNumber.toString());
      formData.append("product_id", slug as string);

      axios
        .post(`${API_URL}/product-photos`, formData)
        .then((response) => {
          console.log("API call successful", response.data);
        })
        .catch((error) => {
          console.error("API call failed", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  const removeGalleryImage = async (id: number) => {
    setIsLoading(true);
    const res = await axios.delete(`${API_URL}/product-photos?ids=[${id}]`);
    if (res.data) {
      toast.success("Gallery image deleted Successfully");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`${API_URL}/products/${slug}`);
        const { data } = response.data;

        if (data["product-photos"] && data["product-photos"].length > 0) {
          const galleryImageFiles = data["product-photos"].map(
            (photo: IPhoto) => ({
              id: photo.id,
              product_id: photo.product_id,
              image: photo.image,
              order_number: photo.order_number,
              created_at: photo.created_at,
              updated_at: photo.updated_at,
            })
          );
          setGalleryImages(galleryImageFiles);
        }
      } catch (error) {
        console.error("Error fetching EMI data:", error);
      }
    };
    fetchProductData();
  }, [slug, isLoading]);

  return (
    <Display>
      <FileInput label="Gallery Images" onChange={handleGalleryImageChange} />
      <div className="update-gallery">
        {galleryImages &&
          galleryImages.length > 0 &&
          galleryImages.map((productPhoto, index) => (
            <SingleProductPhoto
              key={index}
              productPhoto={productPhoto}
              removeGalleryImage={removeGalleryImage}
            />
          ))}
      </div>
      <p className="wearing">Image Size Should Be 900 x 800. or square size</p>
    </Display>
  );
};

export default GalleryImages;

function SingleProductPhoto({
  productPhoto,
  removeGalleryImage,
}: {
  productPhoto: IGalleryPhoto;
  removeGalleryImage: any;
}) {
  const [orderNumber, setOrderNumber] = useState(productPhoto.order_number);
  const handleChangeOrderNumber = async () => {
    try {
      const response = await axios.patch(`/product-photos/${productPhoto.id}`, {
        order_number: orderNumber,
      });
      toast.success(response.data.message);
    } catch (error) {
      console.log("Product photo update error" + error);
    }
  };
  return (
    <div className="product-image">
      <img
        src={`${API_ROOT}/images/product/${productPhoto.image}`}
        alt="gazi home appliance"
      />
      <input
        type="text"
        defaultValue={productPhoto.order_number}
        onChange={(e) => setOrderNumber(e.target.value)}
      />
      <span className="cross" onClick={handleChangeOrderNumber}>
        <FaCheck />
      </span>
      <span
        className="cross"
        onClick={() => removeGalleryImage(productPhoto.id)}
      >
        <RxCross2 />
      </span>
    </div>
  );
}
