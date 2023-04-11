import "./styles.css";
import Input from "./input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";

interface formvalues {
  username: string;
  email: string;
  password: string;
}

const schema = yup.object({
  username: yup.string().required("username is required"),
  email: yup.string().required("email is required").email("email is not valid"),
  password: yup.string().min(6, "password must be atleast 6 characters")
});

function App() {
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [data, setData] = useState<any>({});
  const [text, setText] = useState<string>("");
  const [fileContent, setFilecontent] = useState<string>();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<formvalues>({
    resolver: yupResolver(schema)
  });

  const formSubmit: SubmitHandler<formvalues> = (data) => {
    setData(data);
    reset();
    setPreviewFiles([]);
    setFilecontent(undefined);
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const selectedFilesArray = Array.from(files);

      setSelectedFiles([...selectedFiles, ...selectedFilesArray]);

      const previewFilesArray: File[] = [];

      for (let i = 0; i < selectedFilesArray.length; i++) {
        const file = selectedFilesArray[i];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (event) => {
          const fileContent = event.target?.result as string;
          const lines = fileContent.split("\n").slice(0, 1);
          setText(lines.join(", "));
        };
        previewFilesArray.push(file);
      }

      setPreviewFiles([...previewFiles, ...previewFilesArray]);
    }
  };

  const handleFileClick = (file: File) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (event) => {
      const fileContent = event.target?.result as string;
      // const lines = fileContent.split("\n").slice(0, 3);
      // setText(lines.join(", "));
      setFilecontent(fileContent);
    };
    reader.onerror = () => {
      console.log("file error", reader.error);
    };
  };

  return (
    <div className="signup">
      <h1>SignUp</h1>
      <p>Enter your details for signup</p>
      <form onSubmit={handleSubmit(formSubmit)}>
        <Input
          id="username"
          placeholder="Enter username"
          type="text"
          register={register("username", { required: "username is required" })}
          errormessage={errors.username?.message}
          label={""}
        />
        <Input
          id="email"
          placeholder="Enter email"
          type="text"
          register={register("email", { required: "email is required" })}
          errormessage={errors.email?.message}
          label={""}
        />
        <Input
          id="password"
          placeholder="Enter password"
          type="text"
          register={register("password", {
            required: "'password' is required"
          })}
          errormessage={errors.password?.message}
          label={""}
        />

        <input
          type="file"
          id="file-upload"
          name="file-upload[]"
          multiple
          accept=".pdf,.doc,.docx"
          onChange={(event) => {
            handleFileInputChange(event);
          }}
        />

        <div>
          {previewFiles.map((file, index) => (
            <div key={index} onClick={() => handleFileClick(file)}>
              {file.name}
              <span>{text}</span>
            </div>
          ))}
        </div>
        <p>{fileContent}</p>
        <button>SignUp</button>
      </form>
    </div>
  );
}

export default App;
