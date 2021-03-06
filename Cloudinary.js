import * as ImagePicker from 'expo-image-picker';

const apiUrl = 'https://api.cloudinary.com/v1_1/guyco10/image/upload';

// cloudinary.config({ 
//   cloud_name: 'guyco10', 
//   api_key: '983665692874594', 
//   api_secret: '1eD2To7tDWfxVJi300SmjarhN0Q' 
// });

// Change 'sample' to any public ID of your choice

const deleteImageFromCloudinary = (image) => {
    cloudinary.uploader.destroy(image, function(result) { alert(result) });
  }
  
  const uploadImageToCloudinary = async (collect, image) => {
    /*const storageRef = ref(storage, collect + "/" + "imageName.jpg")
    const response = fetch(uri)
    const blob = (await response).blob
    const metadata = {
      contentType: 'image/jpg',
    };
    // alert(blob==null)
    uploadBytes(storageRef, blob, metadata).then((snapshot) => {
      // alert('Uploaded a blob or file!');
    });
    // We're done with the blob, close and release it
  
    return await getDownloadURL(storageRef)*/
    let base64Img = `data:image/jpg;base64,${image.base64}`
        
    //Add your cloud name
  
    let data = {
      "file": base64Img,
      "upload_preset": "HomEco",
      "folder": collect
    }
  
    return await fetch(apiUrl, {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
    }).then(async r => {
        let data = await r.json()
        return data.secure_url
    }).catch(err=>console.log(err))
    
  }

  const addImageFromLibrary = async () => {
    return await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4,4],
        quality: 1,
        base64: true,
      })
    }
  
      const takePhotoFromCamera = async() => {
        return await ImagePicker.launchCameraAsync({
          compressImageMaxWidth: 300,
          compressImageMaxHeight: 300,
          cropping: true,
          compressImageQuality: 0.7,
          allowsEditing: true,
          aspect: [4,4],  
          quality: 1,
          base64:true
        })
      }
  
      const takeDocPhotoFromCamera = async() => {
        return await ImagePicker.launchCameraAsync({
          compressImageMaxWidth: 300,
          compressImageMaxHeight: 300,
          cropping: true,
          compressImageQuality: 0.7,
          quality: 1,
          base64:true
        })
      }
      
      const addDocImageFromLibrary = async () => {
        return await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            base64: true,
          })
        }

  export { uploadImageToCloudinary ,deleteImageFromCloudinary , addImageFromLibrary , addDocImageFromLibrary, takePhotoFromCamera, takeDocPhotoFromCamera}