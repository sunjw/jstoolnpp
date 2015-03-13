/*
This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/
#include "TreeViewController.h"

TreeViewController::TreeViewController(HWND hWndWindow, HWND hWndTree):
	m_hWndWindow(hWndWindow), m_hWndTree(hWndTree), m_htiRoot(NULL)
{
	// Find the root item first
	m_htiRoot = TreeView_GetRoot(hWndTree);
}

/*
 * Get next item of current item on the TreeView.
 * If current item has a child (or chidren) item, next will be the first child item.
 * If current item has no child, next will be its sibling item.
 * If current item has no child and no sibling, next will be its parent's (parent's parent's ...) sibling item.
 * If current item's parent is ROOT and has no sibling item, it will return NULL.
 */
HTREEITEM TreeViewController::nextItem(HTREEITEM htiCurrent)
{
	HTREEITEM htiNext = NULL;
	
	// Does it has child.
	htiNext = TreeView_GetChild(m_hWndTree, htiCurrent);
	if(htiNext != NULL)
		return htiNext;

	// Has no child. So find its sibling.
	htiNext = TreeView_GetNextSibling(m_hWndTree, htiCurrent);
	if(htiNext != NULL)
		return htiNext;

	// Has no child and no sibling. Find its parent's (parent's parent's ...) sibling.
	HTREEITEM htiParent = htiCurrent;
	while((htiParent = TreeView_GetParent(m_hWndTree, htiParent)) != NULL)
	{
		htiNext = TreeView_GetNextSibling(m_hWndTree, htiParent);
		if(htiNext != NULL)
			return htiNext;
	}

	return NULL;
}
