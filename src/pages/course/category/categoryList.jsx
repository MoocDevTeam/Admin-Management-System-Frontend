import React from "react";
import { Typography } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import FlexWrap from "../../../components/course/shared/FlexWrap";
import CategoryCard from "../../../components/course/category/CategoryCard";

export default function CategoryList({
  currentCategories,
  handleCategoryClick,
  handleEdit,
  loading,
  error,
}) {
  if (loading) {
    return (
      <FlexWrap>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} variant="rounded" width={300} height={300} />
        ))}
      </FlexWrap>
    );
  }
  if (error) {
    return <Typography sx={{ marginBottom: 4 }}>{error}</Typography>;
  }

  if (currentCategories.length === 0) {
    return (
      <Typography align="center" sx={{ marginBottom: 4 }}>
        No category available at the moment.
      </Typography>
    );
  }

  return (
    <FlexWrap>
      {currentCategories.map((category) => (
        <CategoryCard
          key={category.id}
          categoryId={category.id}
          categoryName={category.categoryName}
          description={category.description || "No description available"}
          imageUrl={category.iconUrl}
          subCategoryCounts={category.childrenCategories?.length || 0}
          onClick={() => handleCategoryClick(category)}
          onEdit={() => handleEdit(category)}
        />
      ))}
    </FlexWrap>
  );
}
