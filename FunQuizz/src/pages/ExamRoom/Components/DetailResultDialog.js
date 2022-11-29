import React from 'react';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import LocalStorageService from '~/Services/LocalStorageService';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    Button,
    Collapse,
    Dialog,
    DialogContent,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import StringHelper from '~/Helpers/StringHelper';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { ExamContext } from '..';

const DetailResultDialog = (props) => {
    const { open, handleClose, examResult } = props;

    console.log('--Detail Result Exams: ', examResult);

    return (
        <Dialog open={open} onClose={handleClose} fullScreen>
            <DialogContent>
                <Button startIcon={<ArrowBackIosIcon />} sx={{ textTransform: 'none', mb: 2 }} onClick={handleClose}>
                    Back
                </Button>
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#F49D1A' }}>Rank</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    Answers
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', color: 'orangered' }}>
                                    Streak
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    Score
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    Bonus
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', color: 'green' }}>
                                    Total
                                </TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {examResult.map((result, index) => (
                                <Row userExam={result} index={index} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
        </Dialog>
    );
};

function Row(props) {
    const { userExam, index } = props;

    const { email } = LocalStorageService.get();

    const { exam } = React.useContext(ExamContext);

    const [collapse, setCollapse] = React.useState(false);

    const score = React.useMemo(() => userExam.totalScore - userExam.totalBonusScore, []);
    const bonusScore = React.useMemo(() => userExam.totalBonusScore, []);
    
    const toggleCollapse = () => setCollapse(!collapse);

    console.log('--Detail User Exam: ', userExam);

    return (
        <React.Fragment>
            <TableRow
                sx={{
                    '& > *': { borderBottom: 'unset' },
                    '&:last-child td, &:last-child th': { border: 0 },
                    bgcolor: email === userExam.username ? '#F9F9F9' : 'transparent',
                }}
            >
                <TableCell component="th" scope="row" sx={{ color: '#F49D1A' }}>
                    {index + 1}
                </TableCell>
                <TableCell component="th" scope="row">
                    {userExam.username}
                </TableCell>
                <TableCell align="center">
                    {userExam.answerResults.map((isCorrect) => {
                        return getStreakIcon(isCorrect);
                    })}
                </TableCell>
                <TableCell align="center" sx={{ color: 'orangered' }}>
                    {userExam.maxCorrectStreak}
                </TableCell>
                <TableCell align="center">{score}</TableCell>
                <TableCell align="center">{bonusScore}</TableCell>
                <TableCell align="center" sx={{ color: 'green' }}>
                    {userExam.totalScore}
                </TableCell>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={toggleCollapse}>
                        {collapse ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                    <Collapse in={collapse} timeout="auto" unmountOnExit>
                        <Box>
                            <Typography variant="body2" component="div" color="text.secondary" mt={2}>
                                --Details--
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Questions</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                            Your answer
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                            Answer time (s)
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                            Result
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {userExam.answers.map((answer, answerIndex) => {
                                        const answerResult = userExam.answerResults[answerIndex];
                                        const question = exam.questions.find((question) => question.id === answer.questionId);
                                        const userAnswer = question.options.find((option) => option.id === answer.optionId);
                                        return (
                                            <TableRow
                                                key={answer.questionId}
                                                sx={{
                                                    '&:last-child td, &:last-child th': { border: 0 },
                                                }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {question.content}
                                                </TableCell>
                                                <TableCell align="center" component="th" scope="row">
                                                    {StringHelper.checkNullAndDefault(userAnswer?.content, '-')}
                                                </TableCell>
                                                <TableCell align="center" component="th" scope="row">
                                                    {StringHelper.checkNullAndDefault(answer.totalTime, '-')}
                                                </TableCell>
                                                <TableCell align="center" component="th" scope="row">
                                                    {getCorrectOrWrongIcon(answerResult)}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const getCorrectOrWrongIcon = (isCorrectAnswer) => {
    if (!isCorrectAnswer) {
        return <CloseIcon fontSize="small" color="error" />;
    }

    return <CheckIcon fontSize="small" color="success" />;
};

const getStreakIcon = (isCorrect) => {
    if (isCorrect) {
        return <LocalFireDepartmentIcon sx={{ color: 'orangered' }} />;
    } else {
        return <LocalFireDepartmentIcon sx={{ color: 'grey' }} />;
    }
};

export default DetailResultDialog;
