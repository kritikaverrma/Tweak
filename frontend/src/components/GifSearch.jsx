import { useState, useEffect } from "react";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Grid } from "@giphy/react-components";

const giphyFetch = new GiphyFetch("JhgZqhlcW3vt649Qtf606wXOCaH3Nk0S"); // Replace with your API Key

const GifSearch = ({ onSelect, setShowGifSearch }) => {
    const [searchTerm, setSearchTerm] = useState("trending");
    const [fetchGifs, setFetchGifs] = useState(() => (offset) => giphyFetch.trending({ offset, limit: 10 }));

    useEffect(() => {
        if (!searchTerm.trim()) return; // Prevents empty search calls
        console.log("fetching based on new search term", searchTerm);
        setFetchGifs(() => (offset) => giphyFetch.search(searchTerm, { offset, limit: 10 }));
    }, [searchTerm]);

    return (
        <div className="p-4 bg-gray-800 rounded absolute w-[300px] [h-400px]">
            <input
                type="text"
                placeholder="Search GIFs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 w-full border rounded bg-gray-900 text-white"
            />
            <div className="mt-2 overflow-y-auto h-[320px]">
                <Grid
                    width={400}
                    columns={3}
                    fetchGifs={fetchGifs}
                    onGifClick={(gif, e) => {
                        e.preventDefault();
                        onSelect(gif)
                    }}
                />
            </div>
            <div>
                <button
                    className="mt-4 rounded-full bg-blue-600 h-6 w-6 text-white"
                    onClick={() => setShowGifSearch(false)}>X</button>
            </div>
        </div>
    );
};

export default GifSearch;



/*onSelect function

(gif) => {
    setSelectedGif(gif);
    setShowGifSearch(false);
}
*/
