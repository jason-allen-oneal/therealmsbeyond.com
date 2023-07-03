type Props = {
  type?: string;
  content: string;
};

const Alert = ({ type, content }: Props) => {
  let alertType = "";
  if (type != undefined) {
    alertType = type;
  }
  return (
    <div className={`alert ${alertType} shadow-lg`}>
      <div>
        <span>{content}</span>
      </div>
    </div>
  );
};

export default Alert;
