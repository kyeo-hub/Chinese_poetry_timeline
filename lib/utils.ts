import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 格式化年份显示
 * @param year 年份，负数表示公元前，正数表示公元后
 * @returns 格式化后的年份字符串
 */
export function formatYear(year: number | null): string {
  if (year === null) return "?"

  if (year > 0) {
    return `${year}年`
  } else {
    return `${Math.abs(year)}年前`
  }
}

/**
 * 格式化生卒年份显示
 * @param birthYear 出生年份
 * @param deathYear 死亡年份
 * @returns 格式化后的生卒年份字符串
 */
export function formatLifeSpan(birthYear: number | null, deathYear: number | null): string {
  if (!birthYear || !deathYear) return ""

  return `${formatYear(birthYear)} - ${formatYear(deathYear)}`
}