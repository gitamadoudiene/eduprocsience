/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/features/api/courseApi";
import { useParams, useNavigate } from "react-router-dom"; // Ajout de useNavigate
import { Loader2 } from "lucide-react";
import { Editor } from "@tinymce/tinymce-react"; // Import TinyMCE

const MEDIA_API = "http://localhost:8080/api/v1/media";

const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureDescription, setLectureDescription] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setBtnDisable] = useState(true);
  const [mediaType, setMediaType] = useState("file"); // 'file' or 'youtube'
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const params = useParams();
  const { courseId, lectureId } = params;
  const navigate = useNavigate(); // Initialisation de useNavigate

  const { data: lectureData } = useGetLectureByIdQuery(lectureId);
  const lecture = lectureData?.lecture;

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle);
      setLectureDescription(lecture.description || "");
      setIsFree(lecture.isPreviewFree);
      setUploadVideoInfo(lecture.videoInfo);
    }
  }, [lecture]);

  const [editLecture, { data, isLoading, error, isSuccess }] = useEditLectureMutation();
  const [removeLecture, { data: removeData, isLoading: removeLoading, error: removeError, isSuccess: removeSuccess }] = useRemoveLectureMutation();

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);
      try {
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });

        if (res.data.success) {
          setUploadVideoInfo({
            videoUrl: res.data.data.url,
            publicId: res.data.data.public_id,
          });
          setBtnDisable(false);
          toast.success(res.data.message);
        }
      } catch (error) {
        toast.error("Échec du téléchargement de la vidéo");
      } finally {
        setMediaProgress(false);
      }
    }
  };

  const handleYoutubeUrlChange = (e) => {
    const url = e.target.value;
    setYoutubeUrl(url);
    if (url) {
      setUploadVideoInfo({
        videoUrl: url,
        publicId: null, // No public ID for YouTube URLs
      });
      setBtnDisable(false);
    } else {
      setBtnDisable(true);
    }
  };

  const editLectureHandler = async () => {
    if (!lectureTitle || !uploadVideoInfo?.videoUrl) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    await editLecture({
      lectureTitle,
      description: lectureDescription,
      videoInfo: uploadVideoInfo,
      isPreviewFree: isFree,
      courseId,
      lectureId,
    });
  };

  const removeLectureHandler = async () => {
    await removeLecture(lectureId);
  };

  useEffect(() => {
    if (isSuccess) {toast.success(data.message);
      navigate(-1);
    }
    if (error) toast.error(error.data.message);
  }, [isSuccess, error]);

  useEffect(() => {
    if (removeSuccess) {
      toast.success(removeData.message);
      navigate(-1); // Naviguer vers l'arrière après une suppression réussie
    }
    if (removeError) toast.error(removeError.data.message);
  }, [removeSuccess, removeError]);

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Modifier la leçon</CardTitle>
          <CardDescription>
            Apportez des modifications et cliquez sur Enregistrer lorsque vous avez terminé.
          </CardDescription>
        </div>
        <Button disabled={removeLoading} variant="destructive" onClick={removeLectureHandler}>
          {removeLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Supprimer"}
        </Button>
      </CardHeader>
      <CardContent>
        <Label>Titre</Label>
        <Input
          value={lectureTitle}
          onChange={(e) => setLectureTitle(e.target.value)}
          type="text"
          placeholder="Titre de la leçon"
        />
        
        <Label>Description</Label>
        {/* Remplacement de RichTextEditor2 par TinyMCE */}
        <Editor
        apiKey="votre-clé-api-tinymce" // Remplacez par votre clé API TinyMCE
        value={lectureDescription}
        onEditorChange={(content) => setLectureDescription(content)}
        init={{
          height: 300,
          menubar: true,
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
          ],
          toolbar:
            "undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help | image",
          images_upload_url: "/api/upload-image", // URL pour le téléversement d'images
          images_upload_handler: async (blobInfo, success, failure) => {
            const formData = new FormData();
            formData.append("file", blobInfo.blob(), blobInfo.filename());

            try {
              const response = await fetch("/api/upload-image", {
                method: "POST",
                body: formData,
              });
              const data = await response.json();
              success(data.imageUrl); // URL de l'image téléversée
            } catch (error) {
              failure("Erreur lors du téléversement de l'image");
            }
          },
        }}
      />
        
        <Label>Type de média</Label>
        <div className="flex items-center space-x-2 my-2">
          <Button
            variant={mediaType === "file" ? "default" : "outline"}
            onClick={() => setMediaType("file")}
          >
            Fichier vidéo
          </Button>
          <Button
            variant={mediaType === "youtube" ? "default" : "outline"}
            onClick={() => setMediaType("youtube")}
          >
            URL YouTube
          </Button>
        </div>
        
        {mediaType === "file" ? (
          <>
            <Label>Vidéo <span className="text-red-500">*</span></Label>
            <Input
              type="file"
              onChange={fileChangeHandler}
              accept="video/*"
              className="w-fit"
            />
          </>
        ) : (
          <>
            <Label>URL YouTube <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              value={youtubeUrl}
              onChange={handleYoutubeUrlChange}
              placeholder="Collez l'URL YouTube ici"
            />
          </>
        )}
        
        <div className="flex items-center space-x-2 my-5">
          <Switch checked={isFree} onCheckedChange={setIsFree} id="airplane-mode" />
          <Label htmlFor="airplane-mode">{isFree ? "La leçon est gratuite" : "La leçon n'est pas gratuite"}</Label>
        </div>
        
        {mediaProgress && <Progress value={uploadProgress} />}
        {mediaProgress && <p>{uploadProgress}% uploaded</p>}
        
        <Button disabled={isLoading || btnDisable} onClick={editLectureHandler}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Mettre à jour la leçon"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default LectureTab;