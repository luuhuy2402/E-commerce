import { useRef } from "react";
import config from "../../constants/config";
import { toast } from "react-toastify";

interface Props {
    onChange?: (file?: File) => void;
}
export default function InputFile({ onChange }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileFromLocal = e.target.files?.[0];
        fileInputRef.current?.setAttribute("value", "");
        if (
            fileFromLocal &&
            (fileFromLocal.size >= config.maxSizeUploadAvatar ||
                !fileFromLocal.type.includes("image"))
        ) {
            toast.error("Dung lượng file tối đa 1 MB. Định dạng:.JPEG, .PNG!");
        } else {
            onChange && onChange(fileFromLocal);
        }
    };
    const handleUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <input
                className="hidden"
                type="file"
                accept=".jpg,.jpeg,.png"
                ref={fileInputRef}
                onChange={onFileChange}
                onClick={(event) => {
                    (event.target as any).value = null;
                }}
            />
            <button
                onClick={handleUpload}
                type="button"
                className="flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm"
            >
                Chọn ảnh
            </button>
        </>
    );
}
