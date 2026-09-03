import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='dbox'>
      <div className="dbox-card">
        <div className="dbox-section">
          <div>
            <h3 className="dbox-heading">100% Handmade</h3>
            <p className="dbox-text">
              Every item on this website is handmade by me! Want something custom?
              Send over a picture, color, size, and description to my{' '}
              <a className="dbox-link" href="https://www.instagram.com/mariemadeit__/?hl=en" target="_blank" rel="noreferrer">
                Instagram
              </a>{' '}
              and I'll respond ASAP.
            </p>
          </div>
        </div>
        <div className="dbox-divider" />
        <div className="dbox-section">
          <div>
            <h3 className="dbox-heading">Digital PDF Patterns</h3>
            <p className="dbox-text">
              <strong>No physical item will be shipped.</strong> After purchase you'll receive an
              email with a secure download link. Each PDF includes:
            </p>
            <ul className="dbox-list">
              <li>Step-by-step written instructions</li>
              <li>Materials and hook size needed</li>
              <li>Skill level and sizing information</li>
              <li>Stitch abbreviations and guide</li>
            </ul>
            <p className="dbox-text">
              Questions about a pattern? Reach out on{' '}
              <a className="dbox-link" href="https://www.instagram.com/mariemadeit__/?hl=en" target="_blank" rel="noreferrer">
                Instagram
              </a>.
            </p>
          </div>
        </div>s
      </div>
    </div>
  )
}

export default DescriptionBox