import React from "react"
import { Link } from "wouter"
import { Snippet } from "fake-snippets-api/lib/db/schema"
import { GitHubLogoIcon, StarIcon, LockClosedIcon } from "@radix-ui/react-icons"
import { GlobeIcon, MoreVertical, PencilIcon, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { OptimizedImage } from "./OptimizedImage"
import { SnippetTypeIcon } from "./SnippetTypeIcon"
import { timeAgo } from "@/lib/utils/timeAgo"

export interface SnippetCardProps {
  /** The snippet data to display */
  snippet: Snippet
  /** Base URL for snippet images */
  baseUrl: string
  /** Whether to show the owner name (useful in starred views) */
  showOwner?: boolean
  /** Whether this is the current user's snippet (enables edit/delete options) */
  isCurrentUserSnippet?: boolean
  /** Callback when delete is clicked */
  onDeleteClick?: (e: React.MouseEvent, snippet: Snippet) => void
  /** Custom class name for the card container */
  className?: string
  /** Custom image size (default is h-16 w-16) */
  imageSize?: string
  /** Custom image transform style */
  imageTransform?: string
  /** Whether to render the card with a link to the snippet page */
  withLink?: boolean
  /** Custom render function for actions */
  renderActions?: (snippet: Snippet) => React.ReactNode
}

export const SnippetCard: React.FC<SnippetCardProps> = ({
  snippet,
  baseUrl,
  showOwner = false,
  isCurrentUserSnippet = false,
  onDeleteClick,
  className = "",
  imageSize = "h-16 w-16",
  imageTransform = "transition-transform duration-300 -rotate-45 hover:rotate-0 hover:scale-110 scale-150",
  withLink = true,
  renderActions,
}) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation
    if (onDeleteClick) {
      onDeleteClick(e, snippet)
    }
  }

  const cardContent = (
    <div
      className={`border p-4 rounded-md hover:shadow-md transition-shadow flex flex-col gap-4 ${className}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`${imageSize} flex-shrink-0 rounded-md overflow-hidden`}
        >
          <OptimizedImage
            src={`${baseUrl}/snippets/images/${snippet.owner_name}/${snippet.unscoped_name}/pcb.svg`}
            alt={`${snippet.owner_name}'s profile`}
            className={`object-cover h-full w-full ${imageTransform}`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-[2px] -mt-[3px]">
            <h2 className="text-md font-semibold truncate pr-[30px]">
              {showOwner && (
                <>
                  <span className="text-gray-700 text-md">
                    {snippet.owner_name}
                  </span>
                  <span className="mx-1">/</span>
                </>
              )}
              <span className="text-gray-900">{snippet.unscoped_name}</span>
            </h2>
            <div className="flex items-center gap-2">
              <SnippetTypeIcon
                type={snippet.snippet_type}
                className="pt-[2.5px]"
              />
              <div className="flex items-center gap-1 text-gray-600">
                <StarIcon className="w-4 h-4 pt-[2.5px]" />
                <span className="text-[16px]">{snippet.star_count || 0}</span>
              </div>
              {isCurrentUserSnippet && onDeleteClick && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-[1.5rem] w-[1.5rem]"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      className="text-xs text-red-600"
                      onClick={handleDeleteClick}
                    >
                      <Trash2 className="mr-2 h-3 w-3" />
                      Delete Snippet
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {renderActions && renderActions(snippet)}
            </div>
          </div>
          <p
            className={`${!snippet.description && "h-[1.25rem]"} text-sm text-gray-500 mb-1 truncate max-w-xs`}
          >
            {snippet.description ? snippet.description : " "}
          </p>
          <div className={`flex items-center gap-4`}>
            {snippet.is_private ? (
              <div className="flex items-center text-xs gap-1 text-gray-500">
                <LockClosedIcon height={12} width={12} />
                <span>Private</span>
              </div>
            ) : (
              <div className="flex items-center text-xs gap-1 text-gray-500">
                <GlobeIcon height={12} width={12} />
                <span>Public</span>
              </div>
            )}
            <div className="flex items-center text-xs gap-1 text-gray-500">
              <PencilIcon height={12} width={12} />
              <span>{timeAgo(new Date(snippet.updated_at))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (withLink) {
    return (
      <Link
        key={snippet.snippet_id}
        href={`/${snippet.owner_name}/${snippet.unscoped_name}`}
      >
        {cardContent}
      </Link>
    )
  }

  return cardContent
}
