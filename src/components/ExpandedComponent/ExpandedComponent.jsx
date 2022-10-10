import { useState } from 'react';
import DataTable from 'react-data-table-component';

const ExpandedComponent = ({ data }) => {
	const [filmsData, setFilmsData] = useState([]);

	const { films } = data;

	Promise.all(
		films.map((film) =>
			fetch(film)
				.then((response) => response.json())
				.then((result) => result)
				.catch((error) => console.log(error))
		)
	)
		.then((responses) => setFilmsData(responses))
		.catch((reason) => console.log(reason));

	const columns = [
		{
			name: 'Title',
			selector: (row) => row.title,
		},
		{
			name: 'Director',
			selector: (row) => row.director,
		},
		{
			name: 'Producer',
			selector: (row) => row.producer,
		},
	];

	return (
		<div>
			<h3>Films</h3>
			{filmsData.length > 0 ? (
				<DataTable columns={columns} data={filmsData} />
			) : (
				<p>Cargando...</p>
			)}
		</div>
	);
};

export default ExpandedComponent;
