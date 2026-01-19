import { useEffect, useState, useCallback } from "react";
import type { Artwork, ApiResponse } from '../types/artwork';
import Pagination from "./Pagination";
import './ArtTable.css';

function ArtTable() {
    // State to store artwork data from API
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    
    // State to show/hide loading message
    const [loading, setLoading] = useState(false);
    
    // State for current page number
    const [currentPage, setCurrentPage] = useState(1);
    
    // State for total number of pages
    const [totalPages, setTotalPages] = useState(1);

    // State to store selected artwork IDs
    const [selectedlds, setSelectedlds] = useState<number[]>([]);

    // Function to fetch artworks from API
    const fetchArtworks = useCallback((page: number) => {
        setLoading(true);

        // Setup request timeout (cancel request after 10 seconds)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        // Fetch data from API
        fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=10&fields=id,title,place_of_origin,artist_display,inscription,date_start,date_end`, 
              { signal: controller.signal })
            .then((res) => res.json())
            .then((data: ApiResponse) => {
                // Update state with fetched data
                setArtworks(data.data);
                const limit = data.pagination.limit || 10;
                setTotalPages(Math.ceil(data.pagination.total / limit));
                setLoading(false);
            })
            .catch((err) => {
                // Handle errors (except abort errors)
                if (err.name !== 'AbortError') {
                    console.error('Fetch error:', err);
                }
                setLoading(false);
            })
            .finally(() => clearTimeout(timeoutId));
    }, []);

    // Run this effect when currentPage changes
    useEffect(() => {
        fetchArtworks(currentPage);
    }, [currentPage, fetchArtworks]);

    // Function to toggle selection of a single row
    const toggleSelection = useCallback((id: number) => {
        setSelectedlds((prev) => {
            // If already selected, remove it. Otherwise, add it.
            if (prev.includes(id)) {
                return prev.filter((i) => i !== id);
            } else {
                return [...prev, id];
            }
        });
    }, []);

    // Function to select/deselect all items on current page
    const toggleSelectAll = useCallback(() => {
        if (artworks.length === 0) return;
        
        // Get IDs of all items on current page
        const currentPageIds = artworks.map(artwork => artwork.id);
        
        // Check if all items are already selected
        const allSelected = currentPageIds.every(id => selectedlds.includes(id));
        
        // If all selected, deselect them. Otherwise, select them.
        if (allSelected) {
            setSelectedlds(prev => prev.filter(id => !currentPageIds.includes(id)));
        } else {
            setSelectedlds(prev => {
                // Use Set to avoid duplicates when adding items
                const newSelection = new Set(prev);
                currentPageIds.forEach(id => newSelection.add(id));
                return Array.from(newSelection);
            });
        }
    }, [artworks, selectedlds]);

    return (
        <div className="table-container">
            <div className="table-header">
                <h2>Artwork List</h2>
                <div className="selection-info">
                    <span className="selection-count">{selectedlds.length} selected</span>
                </div>
            </div>
            {loading && <p className="loading">Loading...</p>}
            {!loading && (
                <table className="art-table">
                    <thead>
                        <tr>
                            {/* Select all checkbox in header */}
                            <th className="select-header" onClick={toggleSelectAll}>
                                <input 
                                    type="checkbox" 
                                    checked={artworks.length > 0 && artworks.every(artwork => selectedlds.includes(artwork.id))}
                                    onChange={toggleSelectAll}
                                    title="Select all on this page"
                                />
                            </th>
                            <th>Title</th>
                            <th>Origin</th>
                            <th>Artist</th>
                            <th>Inscription</th>
                            <th>Start Year</th>
                            <th>End Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Display each artwork in a row */}
                        {artworks.map((artwork) => (
                            <tr 
                                key={artwork.id}
                                className={selectedlds.includes(artwork.id) ? 'selected' : ''}
                                onClick={() => toggleSelection(artwork.id)}
                            >
                                <td className="checkbox-cell">
                                    <input type="checkbox" checked={selectedlds.includes(artwork.id)} />
                                </td>
                                <td className="cell-content" title={artwork.title}>{artwork.title}</td>
                                <td className="cell-content" title={artwork.place_of_origin}>{artwork.place_of_origin}</td>
                                <td className="cell-content" title={artwork.artist_display}>{artwork.artist_display}</td>
                                <td className="cell-content" title={artwork.inscription}>{artwork.inscription}</td>
                                <td className="cell-content" title={String(artwork.date_start)}>{artwork.date_start}</td>
                                <td className="cell-content" title={String(artwork.date_end)}>{artwork.date_end}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </div>
    );
}

export default ArtTable;