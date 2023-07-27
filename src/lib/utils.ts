import { useToast } from "@/components/ui/use-toast";
import ApiError from "@/types/api";
import { AxiosError } from "axios";
import { type ClassValue, clsx } from "clsx"
import { IncomingMessage } from "http";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface UploadProgress {
  [key: string]: number;
}

export const uploadProgress: UploadProgress = {};



export function guessMedia(link: string): string | boolean {
  const extension = link.match(/\.([^.]+)$/)?.[1]?.toLowerCase();

  if (extension) {
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return "img";
    }

    if (['mp4', 'webm', 'ogg'].includes(extension)) {
      return "vid";
    }

    if (['mp3', 'wav', 'ogg'].includes(extension)) {
      return "audio";
    }
  }

  return false;
}



export const formatNumberWithSuffix = (number: number) => {
  const suffixes = ["", "k", "M", "B", "T", "Q"];

  if (number < 1000) {
    return number.toString();
  }

  const magnitude = Math.floor(Math.log10(number) / 3);
  const scaledNumber = number / Math.pow(10, magnitude * 3);

  return scaledNumber.toFixed(1).replace(/\.0$/, "") + suffixes[magnitude];
}


export const renderErrors = (error: ApiError): string | { [field: string]: string[] | string } => {
  if (typeof error.error === "string") {
    // If the error is a simple string, return it directly
    return error?.error;
  }

  let formattedErrors = "";

  for (const field in error.error) {
    if (error.error.hasOwnProperty(field)) {
      const fieldErrors: string[] = error.error[field];

      fieldErrors.forEach((message) => {
        const formattedField = field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
        const errorMessage = `<p>${formattedField}: ${message}\n</p>`;
        formattedErrors += errorMessage;
      });
    }
  }

  return formattedErrors;
}



export const ShowErrorToast = (error: AxiosError) => {
  const { toast } = useToast()

  if (!error?.response) {
    if (error?.code === "ERR_BAD_REQUEST") {
      toast({
        variant: "destructive",
        title: "Oops",
        description: "Malformed syntax or invalid request message framing",
      });
    } else if (error?.code === "ERR_CONNECTION_TIMED_OUT") {
      toast({
        variant: "destructive",
        title: "Oops",
        description: "Connection timed out",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Oops",
        description: "An error occurred",
      });
    }
  } else if (error?.response) {
    toast({
      variant: "destructive",
      title: "Oops",
      description: renderErrors(error?.response?.data).toString(),
    })
  } else {
    toast({
      variant: "destructive",
      title: "Oops",
      description: "An error occurred",
    });
  }
};


export const getCookieValue = (req: IncomingMessage, cookieName: string): string => {
  const rawCookies = req.headers.cookie || '';

  // Parse the cookies from the raw cookie string
  const cookies: { [key: string]: string } = rawCookies.split(';').reduce((cookiesObj: any, cookie) => {
    const [name, value] = cookie.trim().split('=');
    cookiesObj[name] = value;
    return cookiesObj;
  }, {});

  // Get the value of the specified cookie
  const cookieValue = cookies[cookieName] || '';
  return cookieValue;
};