import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../../style/quill-custom.css';
import { useBoxStore } from '../../store/askStore';

function AskEditor({ able, value, func, name }) {
	const modules = {
		toolbar: [
			[{ header: '1' }, { header: '2' }, { font: [] }],
			[{ size: [] }],
			['bold', 'italic', 'underline', 'strike', 'blockquote'],
			[
				{ list: 'ordered' },
				{ list: 'bullet' },
				{ indent: '-1' },
				{ indent: '+1' },
			],
			['link', 'image', 'video'],
			['clean'],
		],
		clipboard: {
			// toggle to add extra line breaks when pasting HTML:
			matchVisual: false,
		},
	};

	const formats = [
		'header',
		'font',
		'size',
		'bold',
		'italic',
		'underline',
		'strike',
		'blockquote',
		'list',
		'bullet',
		'indent',
		'link',
		'image',
		'video',
	];
	const { actData, setActData } = useBoxStore();
	const click = (item) => {
		let obj = { ...actData[0] };
		for (let el in obj) {
			if (el === item) {
				obj[el] = true;
			} else {
				obj[el] = false;
			}
		}
		setActData(obj);
	};

	return (
		<div onClick={() => click(name)}>
			<ReactQuill
				modules={modules}
				formats={formats}
				theme='snow'
				readOnly={!able}
				value={value}
				onChange={(value) => func(value)}
			/>

			{/* <div dangerouslySetInnerHTML={{ __html: content }} /> */}
		</div>
	);
}

export default AskEditor;
