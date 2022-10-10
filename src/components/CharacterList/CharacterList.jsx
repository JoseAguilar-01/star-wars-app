import axios from 'axios';
import DataTable from 'react-data-table-component';

import { useState, useEffect } from 'react';
import ExpandedComponent from '../ExpandedComponent/ExpandedComponent';

import './CharacterList.css';

const CharacterList = () => {
	const [characters, setCharacters] = useState([]);
	const [pages, setPages] = useState({
		prev: '',
		next: '',
	});
	const [currentPage, setCurrentPage] = useState('1');
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState('');
	const [activateSearch, setActivateSearch] = useState(false);
	const [searchedCharacters, setSearchedCharacters] = useState([]);

	useEffect(() => {
		const getCharacters = async () => {
			setLoading(true);
			const url = 'https://swapi.dev/api/people/';

			try {
				const { data } = await axios(url);

				setCharacters(data.results);
				setPages({ prev: data.previous ?? '', next: data.next ?? '' });
			} catch (error) {
				console.log(error);
			}
			setLoading(false);
		};

		getCharacters();
	}, []);

	useEffect(() => {
		setSearchedCharacters([]);
		setActivateSearch(false);
	}, [search]);

	const handlePageChange = async (url) => {
		if (url === '') return;

		setLoading(true);
		try {
			const { data } = await axios(url);

			setCharacters(data.results);
			setPages({ prev: data.previous ?? '', next: data.next ?? '' });
			setCurrentPage(url.slice(-1));
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setLoading(true);
		const url = `https://swapi.dev/api/people/?search=${search}`;

		try {
			const { data } = await axios(url);

			setSearchedCharacters(data.results);
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	};

	const columns = [
		{
			name: 'Name',
			selector: (row) => row.name,
		},
		{
			name: 'Height',
			selector: (row) => row.height,
		},
		{
			name: 'Mass',
			selector: (row) => row.mass,
		},
		{
			name: 'Birth year',
			selector: (row) => row.birth_year,
		},
		{
			name: 'Films',
			selector: (row) => row.films,
		},
	];

	return (
		<>
			<nav className="navbar">
				<form
					className="navbar_form"
					onSubmit={(e) => {
						handleSubmit(e);
						setActivateSearch(true);
					}}
				>
					<input
						type="text"
						className="form_input"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						name="search"
						placeholder="Buscar por nombre del personaje"
						required
					/>
					<input type="submit" className="form_button" value="Buscar" />
				</form>
			</nav>
			<div className="list">
				{loading ? (
					<h3>Cargando...</h3>
				) : activateSearch && search && searchedCharacters.length > 0 ? (
					<>
						<h2>Character List</h2>
						<DataTable
							columns={columns}
							data={searchedCharacters}
							expandableRows
							expandableRowsComponent={ExpandedComponent}
						/>
					</>
				) : activateSearch && search && searchedCharacters.length < 1 ? (
					<p>No se encontraron coincidencias...</p>
				) : (
					<>
						<h2>Character List</h2>
						<DataTable
							columns={columns}
							data={characters}
							expandableRows
							expandableRowsComponent={ExpandedComponent}
						/>
					</>
				)}

				<div className="buttons">
					<button
						className="button_prev"
						onClick={() => handlePageChange(pages.prev)}
					>
						Prev
					</button>
					<p>{currentPage}</p>
					<button
						className="button_next"
						onClick={() => handlePageChange(pages.next)}
					>
						Next
					</button>
				</div>
			</div>
		</>
	);
};

export default CharacterList;
