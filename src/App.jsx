import { useState, useEffect } from 'react';
import Fuse from 'fuse.js'

import './index.css';

const App = () => {
  const [allCountries, setAllCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [searchVal, setSearchVal] = useState('')

  const options = {
    includeScore: true,
    keys: ['name','languages.name, capital']
  }
  // performs a fuzzy search on multiple keys at once
  const fuse = new Fuse(allCountries, options)


  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const call = await fetch('https://restcountries.com/v2/all')
        const res = await call.json()

        setAllCountries(res)
      } catch (error) {
        console.error('error while fetching countries', error)
      }
    }

    fetchCountries()
  }, [setAllCountries])

  const runSearch = () => {
    const results = fuse.search(searchVal)

    // now sort results to show most relevant results first
    const sorted = results.sort((a, b) => a.score - b.score)
    const final = sorted.map(res => res.item)

    setFilteredCountries(final)
  }


  const handleChange = (e) => {
    setSearchVal( e.target.value)

    runSearch()
  }

  let shown;
  if(searchVal.length > 0) {
    shown = filteredCountries;
  } else {
    shown = allCountries;
  }

  if(allCountries) {
    return (
    <div className='p-5'>
      <header className='text-center'>
        <h1 className='text-4xl'>World Countries Data by <a href='https://hellomarquis.com' target="_blank" className="text-[#ee5050] hover:text-red-300">Marquis</a></h1>
        <p>Currently, we have <span className='font-bold'>{allCountries.length}</span> countries</p>
        {/* below is only shown while filtering */}
        {shown === filteredCountries && (
          <p className='italic'>Only <span className='font-bold'>{filteredCountries.length}</span> countries shown during search...</p>
        )}

        <form className='my-4 mx-auto' onSubmit={e => e.preventDefault()}>
          <label htmlFor="search" className='sr-only'>search</label>
          <input type="text" id="search" name="search" onChange={handleChange} value={searchVal}
            placeholder="Search countries by name, capital, or languages spoken"
            className='w-full max-w-2xl mx-auto border-solid border-2 border-blue rounded text-center block' />
        </form>
      </header>

      <section className='mt-4 flex flex-col flex-wrap gap-y-4 lg:gap-x-4 lg:flex-row'>
        {shown.map(country => {
          const { name, flags, languages, population } = country;
          const langNames = languages.map(lang => lang.name);

          return (
            <article key={name} className="w-full max-w-xl lg:max-w-md mx-auto p-4 bg-neutral-200 rounded">
              <div className='flex flex-col items-center'>
                <img src={flags.png} alt={`flag for ${name}`} className="max-w-md w-full h-[220px]" />

                <h2 className='my-2 text-orange-400 font-bold'>{name}</h2>
                <p><span className='font-bold'>Languages:</span> {langNames.join(", ")}</p>
                <p><span className='font-bold'>Population:</span> {population.toLocaleString("en-US")}</p>
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}

return <h1>Hello from React! Loading...</h1>
};

export default App;
