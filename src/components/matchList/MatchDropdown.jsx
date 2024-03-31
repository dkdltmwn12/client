import React, { useState } from 'react'

export default function MatchDropdown({matchList}) {

    const [selectedOption, setSelectedOption] = useState('');
    const [filteredMatchList, setFilteredMatchList] = useState(matchList);

    const options = [
        { value: '일반', label: '일반' },
        { value: '솔로랭크', label: '솔로랭크' },
        { value: '자유랭크', label: '자유랭크' },
        { value: '무작위 총력전', label: '무작위 총력전' },
    ];

    const matchFilterButtonHandler = (queueId) => {
        const filteredList = matchList.filter((match) => match.queueId === queueId);
        setFilteredMatchList(filteredList)
    }

    const handleOptionChange = (event) => {
      setSelectedOption(event.target.value);
    };

  return (
    <div className='bg-slate-800 text-white rounded-tl-md rounded-tr-md'>
        <ul className='flex p-2'>
            <li><button>전체</button></li>
            <li className='ml-2'><button onClick={() => matchFilterButtonHandler(420)}>솔로랭크</button></li>
            <li className='ml-2'>
                <select className='bg-slate-800' value={selectedOption} onChange={handleOptionChange}>
                    <option value="">큐 타입</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </li>
        </ul>
    </div>
  )
}
