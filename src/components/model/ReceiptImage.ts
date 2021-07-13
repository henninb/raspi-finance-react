import { ImageFormatType } from "./ImageFormatType";

export default interface ReceiptImage {
  receiptImageId: number;
  transactionId: number;
  activeStatus: Boolean;
  imageFormatType: ImageFormatType;
  image: String;
  thumbnail: String;
}
