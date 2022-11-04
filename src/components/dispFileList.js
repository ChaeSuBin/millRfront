
let te = 0;

export const FilesList = ({row, title, type, size, hash}) => {
  if(te === row){
    ++te;
    return 0;
  }
  else{
    return(
      <>
        <p>{title}
          <br/>{type}
          <br/>{hash}
        </p>
      </>
    )
  }
}