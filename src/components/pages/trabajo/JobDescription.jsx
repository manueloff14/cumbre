import ReactMarkdown from 'react-markdown';

export default function JobDescription({ jobDescription }) {
    return (
        <div className="prose">
            <ReactMarkdown>{jobDescription}</ReactMarkdown>
        </div>
    );
}