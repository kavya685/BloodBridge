package com.bloodbridge.util;

import com.bloodbridge.enums.BloodGroup;

public class BloodCompatibility {
    public static boolean isCompatible(BloodGroup donorGroup, BloodGroup recipientGroup)
    {
        return switch (donorGroup) {
            case O_NEGATIVE ->
                    true;

            case O_POSITIVE ->
                    recipientGroup == BloodGroup.O_POSITIVE
                            || recipientGroup == BloodGroup.A_POSITIVE
                            || recipientGroup == BloodGroup.B_POSITIVE
                            || recipientGroup == BloodGroup.AB_POSITIVE;

            case A_NEGATIVE ->
                    recipientGroup == BloodGroup.A_NEGATIVE
                            || recipientGroup == BloodGroup.A_POSITIVE
                            || recipientGroup == BloodGroup.AB_NEGATIVE
                            || recipientGroup == BloodGroup.AB_POSITIVE;

            case A_POSITIVE ->
                    recipientGroup == BloodGroup.A_POSITIVE
                            || recipientGroup == BloodGroup.AB_POSITIVE;

            case B_NEGATIVE ->
                    recipientGroup == BloodGroup.B_NEGATIVE
                            || recipientGroup == BloodGroup.B_POSITIVE
                            || recipientGroup == BloodGroup.AB_NEGATIVE
                            || recipientGroup == BloodGroup.AB_POSITIVE;

            case B_POSITIVE ->
                    recipientGroup == BloodGroup.B_POSITIVE
                            || recipientGroup == BloodGroup.AB_POSITIVE;

            case AB_NEGATIVE ->
                    recipientGroup == BloodGroup.AB_NEGATIVE
                            || recipientGroup == BloodGroup.AB_POSITIVE;

            case AB_POSITIVE ->
                    recipientGroup == BloodGroup.AB_POSITIVE;
        };
    }
}
