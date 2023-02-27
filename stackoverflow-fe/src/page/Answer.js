import styled from 'styled-components';
import AnsHeader from '../components/answer/AnsHeader';
import AnsCon from '../components/answer/AnsCon';
import AnsEditor from '../components/answer/AnsEditor';
import AnsInput from '../components/answer/AnsInput';
import useAnsStore from '../store/ansStore';
import RightMenu from '../components/list/RightMenu';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

const BREAK_POINT_PC = 1100;

const AnsWrap = styled.div`
	max-width: 830px;
	width: 100%;
	padding: 3rem 1.33rem;
`;

const ConTitle = styled.h4`
	margin: 1rem 0 0.75rem;
	font-weight: 500;
`;

const InputButton = styled.button`
	margin-top: 0.8rem;
	padding: 0.45rem 0.5rem;
	color: #fff;
	font-size: 0.6rem;
	font-weight: 500;
	border-radius: 0.188rem;
	background: hsl(206, 100%, 52%);
	box-shadow: inset 0 0.08rem 0 0 hsla(0, 0%, 100%, 0.4);
	cursor: ${(props) => (props.disabled ? 'not-allowed' : 'cursor')};
`;

const SideWrap = styled.div`
	margin-top: 3rem;
	@media only screen and (max-width: ${BREAK_POINT_PC}px) {
		display: none;
	}
`;

function Answer() {
	const { page, answer } = useAnsStore();
	const { edTitle, edBody, edTag } = useAnsStore();
	const { answerBind, answerReset, edTitleBind, edBodyBind, edTagBind } =
		useAnsStore();
	const { ansItem, ansDownList, comList } = useAnsStore();
	const { getAnswerItem, getAnsDown, getCom, addDown } = useAnsStore();

	const handleAnswer = (e) => {
		e.preventDefault();

		const item = {
			questionId: ansDownList.length + 1,
			answerContent: answer,
		};

		addDown(
			`${process.env.REACT_APP_API_URL}/answers?_csrf=8eae838f-62c9-4aaa-bff2-c80ca10b2213`,
			item,
		);

		answerReset(ansDownList);
	};

	const handleEdit = (e) => {
		e.preventDefault();

		const item = {
			title: edTitle,
			body: edBody,
			tag: edTag,
		};

		console.log(item);
	};

	let { id } = useParams();

	useEffect(() => {
		getAnswerItem(`${process.env.REACT_APP_API_URL}/questions/${id}`);
		getAnsDown(`${process.env.REACT_APP_API_URL}/answers?questionId=${id}`);
		getCom(
			`${process.env.REACT_APP_API_URL}/comments?qaType=Question&qaId=${id}`,
		);
	}, [getAnswerItem, getAnsDown, getCom, id]);

	console.log(ansDownList.data);

	return (
		<>
			{ansItem.data && (
				<>
					<AnsWrap>
						{page === 'read' ? (
							<>
								<AnsHeader data={ansItem.data} />
								<AnsCon
									type={'question'}
									data={ansItem.data}
									QaCom={comList.data}
								/>
								<ConTitle>{`${ansItem.data.answers} Answers`}</ConTitle>
								{ansDownList.data &&
									ansDownList.data.map((el, idx) => (
										<AnsCon key={ansDownList.data.answerId || idx} />
									))}
								<>
									<ConTitle>Your Answer</ConTitle>
									<AnsEditor func={answerBind} />
									<InputButton onClick={handleAnswer}>
										post your answer
									</InputButton>
								</>
							</>
						) : (
							<>
								<ConTitle>Title</ConTitle>
								<AnsInput func={edTitleBind} />
								<ConTitle>Body</ConTitle>
								<AnsEditor func={edBodyBind} />
								<ConTitle>Tags</ConTitle>
								<AnsInput func={edTagBind} />
								<InputButton onClick={handleEdit}>Save Edits</InputButton>
							</>
						)}
					</AnsWrap>
					<SideWrap>
						<RightMenu />
					</SideWrap>
				</>
			)}
		</>
	);
}

export default Answer;
