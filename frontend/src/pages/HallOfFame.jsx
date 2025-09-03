import { useEffect, useState, useMemo } from "react";
import { getGames } from '../api/games';
import { getGenres } from '../api/genres';
import { getYears } from '../api/years';
import { getOrigins } from '../api/origins';
import { getCategories } from '../api/categories';
import { getSubcategories } from '../api/subcategories';
import { getTiers } from '../api/tiers';
import GameCard from '../components/GameCard';
import SidebarFilters from "../components/SidebarFilters";

function HallOfFame() {
  return (
    <div>
      
    </div>
  );
}

export default HallOfFame;
