import React, { useEffect } from "react";
import { IconAward, IconPrinter, IconX, IconBloodDrop } from "./icons/Icons";
import "../styles/DonationCertificate.css";

function DonationCertificateModal({ application, donorName, onClose }) {
    if (!application) return null;

    useEffect(() => {
        document.body.classList.add("cert-modal-open");
        return () => {
            document.body.classList.remove("cert-modal-open");
        };
    }, []);

    const formattedDate = application.appliedAt
        ? new Date(application.appliedAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric"
          })
        : new Date().toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric"
          });

    const certId = `BB-CERT-${application.id || "108"}-${new Date().getFullYear()}`;
    const bloodGroupFormatted = application.bloodGroup
        ? application.bloodGroup.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")
        : "Verified";

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="cert-modal-backdrop" onClick={onClose}>
            <div className="cert-modal-container" onClick={(e) => e.stopPropagation()}>
                {/* Actions Toolbar (Hidden on Print) */}
                <div className="cert-modal-actions no-print">
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <IconAward size={20} color="#059669" />
                        <span style={{ fontWeight: "700", color: "var(--text-primary)" }}>
                            Blood Donation Certificate
                        </span>
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                        <button
                            className="primary-button"
                            style={{
                                background: "#059669",
                                borderColor: "#059669",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "8px 18px",
                                fontSize: "0.875rem"
                            }}
                            onClick={handlePrint}
                        >
                            <IconPrinter size={16} />
                            Download / Print as PDF
                        </button>
                        <button
                            className="secondary-button"
                            style={{ padding: "8px 16px", fontSize: "0.875rem", display: "inline-flex", alignItems: "center", gap: "4px" }}
                            onClick={onClose}
                        >
                            <IconX size={15} />
                            Close
                        </button>
                    </div>
                </div>

                {/* Printable Certificate Sheet */}
                <div className="cert-sheet">
                    <div className="cert-inner-frame">
                        {/* Top Watermark / Header */}
                        <div className="cert-header">
                            <div className="cert-emblem">
                                <IconBloodDrop size={32} color="#dc2626" />
                            </div>
                            <div className="cert-brand">BLOODBRIDGE NATIONAL HEALTHCARE NETWORK</div>
                            <p className="cert-motto">"Every Drop Connects Life • Saving Humanity Together"</p>
                        </div>

                        <div className="cert-divider"></div>

                        <h1 className="cert-title">Certificate of Appreciation</h1>
                        <p className="cert-subtitle">THIS HONOR IS PROUDLY PRESENTED TO</p>

                        {/* Recipient Donor Name */}
                        <div className="cert-recipient-container">
                            <div className="cert-recipient-name">
                                {donorName || application.donorName || "Honored Life Saver"}
                            </div>
                        </div>

                        <p className="cert-desc">
                            In sincere and grateful recognition of your voluntary, life-saving blood donation.
                            Your selfless compassion, benevolence, and courage have directly supported patient critical care
                            and inspired hope in our community.
                        </p>

                        {/* Details Verification Grid */}
                        <div className="cert-grid">
                            <div className="cert-grid-item">
                                <span className="cert-item-label">Medical Center / Hospital</span>
                                <span className="cert-item-val">{application.hospitalName || "Partner Medical Center"}</span>
                            </div>
                            <div className="cert-grid-item">
                                <span className="cert-item-label">Blood Group</span>
                                <span className="cert-item-val cert-highlight">{bloodGroupFormatted}</span>
                            </div>
                            <div className="cert-grid-item">
                                <span className="cert-item-label">Date of Contribution</span>
                                <span className="cert-item-val">{formattedDate}</span>
                            </div>
                            <div className="cert-grid-item">
                                <span className="cert-item-label">Certificate Serial ID</span>
                                <span className="cert-item-val" style={{ fontFamily: "monospace", fontSize: "0.95rem" }}>
                                    {certId}
                                </span>
                            </div>
                        </div>

                        {/* Bottom Seal & Signatures */}
                        <div className="cert-footer">
                            <div className="cert-signature-block">
                                <div className="cert-signature-line">Dr. A. Verma</div>
                                <span className="cert-sign-title">Chief Medical Officer</span>
                                <span className="cert-sign-org">{application.hospitalName || "Hospital Medical Board"}</span>
                            </div>

                            <div className="cert-seal-badge">
                                <div className="cert-seal-inner">
                                    <span className="cert-seal-star">★ ★ ★</span>
                                    <span className="cert-seal-text">OFFICIAL</span>
                                    <span className="cert-seal-sub">LIFESAVER</span>
                                </div>
                            </div>

                            <div className="cert-signature-block" style={{ textAlign: "right" }}>
                                <div className="cert-signature-line">BloodBridge Council</div>
                                <span className="cert-sign-title">Director of Transfusion</span>
                                <span className="cert-sign-org">BloodBridge Health Foundation</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DonationCertificateModal;
