import { Card, Id } from "@/app/types"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { TrashIcon } from "lucide-react"
import React, { useState } from 'react'

interface Props {
    card: Card
    deleteCard: (id: Id) => void
    updateCard: (id: Id, content: string)  => void
}

export const DragCard = ({ card, deleteCard, updateCard }: Props) => {
    const [mouseIsOver, setMouseIsOver] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: card.id,
        data: {
            type: "Card",
            card,
        },
        disabled: editMode,
    })
    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }
    const toggleEditMode = () => {
        setEditMode((prev) => !prev)
        setMouseIsOver(false)
    }

    if (isDragging) {
        return (
            <div ref={setNodeRef} style={style}
                className="opacity-30 bg-[#0D1117] p-2 w-[100px] min-h-[100px]
                items-center flex text-left rounded-md border-2 border-blue-500
                cursor-grab relative"
            />
        )
    }
    if (editMode) {
        return (
            <div ref={setNodeRef} style={style} {...attributes} {...listeners}
                className="bg-[#0D1117] p-2 w-[100px] h-[100px] min-h-[100px]
                items-center flex text-left rounded-md border-2 border-blue-500
                cursor-grab relative"
            >
                <textarea className="h-[90%] w-full resize-none border-none rounded
                    bg-transparent text-white focus:outline-none"
                    value={card.content}
                    autoFocus
                    placeholder="card content"
                    onBlur={toggleEditMode}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && e.shiftKey) {
                            toggleEditMode()
                        }
                    }}
                    onChange={(e) => updateCard(card.id, e.target.value)}
                />
            </div>
        )
    }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
        onClick={toggleEditMode}
        className="bg-[#0D1117] p-2 w-[100px] h-[100px] min-h-[100px]
        items-center flex text-left rounded-md border-2 border-blue-500
        cursor-grab relative"
        onMouseEnter={() => {
            setMouseIsOver(true)
        }}
        onMouseLeave={() => {
            setMouseIsOver(false)
        }}
    >
        <p className="h-[90%] w-full whitespace-pre-wrap">
            {card.content}
        </p>
        {mouseIsOver && (
            <button onClick={() => {
                deleteCard(card.id)
            }}
                className="stroke-white absolute right-0 top-20 -translate-y-1/2 p-2 rounded
                opacity-60 hover:opacity-100"
            >
                <TrashIcon />
            </button>
        )}
    </div>
  )
}
