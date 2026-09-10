interface DragItemProps {
  e: React.DragEvent<HTMLDivElement>;
  setDragActive: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ContractDragItemProps extends DragItemProps {
  setContractFile: React.Dispatch<React.SetStateAction<File | null>>;
}

/**
 * Action to handle Drag actions
 * @param param0
 */
export const handleDrag = ({ e, setDragActive }: DragItemProps) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(e.type === "dragover");
};

export const handleDrop = ({ e, setDragActive, setContractFile }: ContractDragItemProps) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if(isValidFile(e.dataTransfer.files[0])){
        setContractFile(e.dataTransfer.files[0])
      }
    }
};


const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const allowedExtensions = ['pdf'];

export const isValidFile = (file: File) => {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (!extension || !allowedExtensions.includes(extension)) {
    return false;
  }

  if (file.size > MAX_FILE_SIZE) {
    return false;
  }

  return true;
};