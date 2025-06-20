import { useState } from "react";
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import { FaFileUpload, FaPlus, FaFileDownload, FaCheck, FaEdit } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";
import * as XLSX from "xlsx";

export const ToolText = ({ id, children, title }) => (
  <OverlayTrigger
    overlay={<Tooltip
      id={id}>{title}</Tooltip>}
  >
    {children}
  </OverlayTrigger>
);

export const UploadBtn = (props) => {
  const { onClick } = props;
  return (
    <ToolText title="Excel upload" id="tooltip-3">
      <Button
        onClick={onClick}
        className="rounded-0"
        type="button"
        variant="secondary"
      >
        <FaFileUpload />
      </Button>
    </ToolText>
  );
};

export const ExportExcelBtn = (props) => {
  const { onClick } = props;
  return (
    <ToolText title="Download Excel" id="tooltip-2">
      <Button
        onClick={onClick}
        className="rounded-0"
        type="button"
        variant="success-emphasis"
      >
        <RiFileExcel2Line />
      </Button>
    </ToolText>
  );
};

export const AddBtn = (props) => {
  const { onClick, disabled } = props;
  return (
    <ToolText title="Add new" id="tooltip-2">
      <Button
        onClick={onClick}
        className="rounded-0"
        type="button"
        variant="success"
        disabled={disabled}
      >
        <FaPlus />
      </Button>
    </ToolText>
  );
};

export const DownloadBtn = (props) => {
  const { onClick, href } = props;
  return (
    <ToolText title="Download Template" id="tooltip-2">
      <Button
        href={href}
        onClick={onClick}
        className="rounded-0"
        type="button"
        variant="dark"
      >
        <FaFileDownload />
      </Button>
    </ToolText>
  );
};

export const TemplateBtn = (props) => {
  return (
    <ToolText title="Excel Template" id="tooltip-3">
      <Button
        className="rounded-0"
        type="button"
        variant="dark"
        as="a"
        href={props.file}
      >
        <FaFileDownload />
      </Button>
    </ToolText>
  );
};
export const paginateSlicer = (arr, page_size, page_number) => {
  return arr.slice((page_number - 1) * page_size, page_number * page_size);
};

export const usePagination = (initialPage) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return { currentPage, onPageChange };
};

export const DataNotFound = (props) => {
  const { message } = props;
  return (
    <div className="d-flex justify-content-center align-items-center min-h-table">
      <h5 className="text-center tracking-widest">{message}!</h5>
    </div>
  );
};

export const readExcelAsJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(worksheet, {
          defval: null,
          header: 1,
          raw: false,
        });

        const headers = json[0];
        const filteredJson = json
          .slice(1)
          .map((row) =>
            row.reduce((acc, cell, index) => {
              if (headers[index]) {
                acc[headers[index]] = cell;
              }
              return acc;
            }, {})
          )
          .filter((row) => Object.values(row).some((cell) => cell !== null));

        resolve(filteredJson);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};
export const serialNo = (page, index) => {
  return Math.max(index + 1 + (page - 1) * 10, 1 + index);
};


export const EditBtn = (props) => {
  const { onClick, name, children } = props;
  return (
    <ToolText title="Edit" id="tooltip-2">
      <Button
        onClick={onClick}
        className="rounded-0"
        type="button"
        variant="primary"
      >
        <FaEdit />
      </Button>
    </ToolText>
  );
}