import { postUploadArtwork, getMerge } from "../../api";

export const UploadFiles = ( fileBufferList, fileInfoList, finalHash ) => {
  let uploadState = false;
  
    const size = 1024 * 50; //50KB 50KB Section size
    fileBufferList.map(async(file, index) => {
      let fileChunks = [];
      let fileIndex = 0;
      for(let cur = 0; cur < file.length; cur += size) {
        fileChunks.push({
          section: fileIndex++,
          chunk: file.slice(cur, cur + size),
        });
      }
      uploadList(fileInfoList, fileChunks, index++);
    })
    setTimeout(()=>{
      mergeChunks(fileInfoList, finalHash);
	  },3000);
}
const uploadList = (fileInfoList, fileChunks, _index) => {
  fileChunks.map((item, index) => {
    const record = {
      fileName: fileInfoList[_index].name,
      section: item.section,
      chunk: item.chunk,
    }
    console.log(record);
    postUploadArtwork(record).then(result => {
      console.log(result);
    })
  })
}
const mergeChunks = async(fileInfoList, finalHash) => {
  fileInfoList.map((item, idx) => {
    getMerge(item.name, finalHash).then(response => {
      console.log(response);
    })
  })
}